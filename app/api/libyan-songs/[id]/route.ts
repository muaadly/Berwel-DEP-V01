import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { createClient } from '@/utils/supabase/server'; // Import the server-side Supabase client

export const dynamic = 'force-dynamic'; // Ensure this route is not cached

// Define the interface for the data structure in the Libyan Songs CSV
interface LibyanSongCsvRow {
  'Song Number': string; // Ensure this matches your CSV header exactly
  'Song Name': string;
  'Singer': string; // Corrected key to match CSV header
  'Category': string;
  'Lyrics Status': string;
  'Writer': string;
  'Composer': string;
  'Year': string;
  'Recording Status': string;
  'SoundCloud Link': string;
  'Views': string;
  'Likes': string; // Keep likes in CSV for now, will sync later or use Supabase count
  'Image Name': string; // Corrected key to match CSV header
  'Sheet Music Name': string; // Corrected based on code usage
  'Lyrics': string;
}

// Define the type for the data fetched from the Supabase 'songs' table
interface SupabaseSongRow {
  id: string; // UUID is treated as string in JS
  "Song Number": number; // Assuming it's stored as bigint or number
  "Song Name": string;
  "Singer": string;
  "Category": string;
  "Lyrics Status": string;
  "Writer": string;
  "Composer": string;
  "Year": string;
  "Recording Status": string;
  "SoundCloud Link": string;
  "Image Name": string;
  "Sheet Music Name": string;
  "Lyrics": string;
  views?: number; // Added views property to SupabaseSongRow
  likes?: number; // Added likes property for consistency, assuming it might be returned
  likes_count?: number; // Added likes_count for consistency, assuming it might be returned
}

// Define the interface for individual comment fetched from Supabase *in this API route*
// This should match the select statement in the comments fetch
interface ApiComment {
  id: string;
  created_at: string;
  content: string;
  user_id: string;
  user: { // User details from the join
    id: string;
    email: string;
  } | null; // user might be null if the join fails or user is deleted
}

// Update the type definition for the returned song data
interface ReturnedSong {
  id: string | null; // Allow id to be null if UUID not found
  songName: string;
  singerName: string;
  category: string;
  lyricsStatus: string;
  writer: string;
  composer: string;
  year: string;
  recordingStatus: string;
  soundCloudLink: string;
  views: number;
  likes_count: number; // Changed from 'likes' to 'likes_count'
  image: string;
  singerImage: string;
  sheetMusic: string;
  lyrics: string;
  comments: ApiComment[]; // Use the API-specific comment type
  isLikedByUser: boolean;
}

export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    const { params } = context;
    const { id: songNumberFromUrl } = await params; // Await params directly
    console.log(`[API] Received song number from URL: ${songNumberFromUrl}`);
    const supabase = await createClient();

    // --- 1. Fetch song from Supabase 'songs' table using the song number ---
    // Assuming the column name for the original CSV song number in your 'songs' table is "Song Number"
    const selectColumns = 'id, "Song Number", "Song Name", "Singer", "Category", "Lyrics Status", "Writer", "Composer", "Year", "Recording Status", "SoundCloud Link", "Image Name", "Lyrics", likes_count';
    console.log(`[API] Attempting to fetch song from DB with select: ${selectColumns}`);
    console.log("[API] Executing Supabase select query...");
    const { data: songFromDb, error: dbFetchError } = await supabase
      .from('songs')
      .select(selectColumns) // Select columns you need
      .eq('"Song Number"' as string, parseInt(songNumberFromUrl, 10)); // Query using the numeric song number from URL

    if (dbFetchError) {
        console.error('[API] Error fetching song from database:', dbFetchError.message);
        // If database fetch fails, try falling back to CSV data if necessary for basic info
        // but we won't be able to fetch likes/comments/trending without a UUID
    } else {
        console.log(`[API] Database fetch successful: Found ${songFromDb.length} rows.`);
    }

    // Use type assertion for songFromDb result and extract the UUID
    const songDetailsFromDb: SupabaseSongRow | null = songFromDb && songFromDb.length > 0 ? songFromDb[0] as SupabaseSongRow : null;
    const songIdUuid = songDetailsFromDb ? songDetailsFromDb.id : null; // This is the UUID

    console.log(`[API] Extracted UUID from DB data: ${songIdUuid}`);

    if (!songIdUuid) {
       // If no song found in DB or no UUID, try to find in CSV but indicate limited functionality
       console.warn(`[API] Song with number ${songNumberFromUrl} not found in database or missing UUID. Attempting CSV fallback.`);
       // Proceed to read from CSV but skip Supabase interactions that require UUID
    }

     // --- 2. Fetch data from CSV (still needed for details not in DB yet or as fallback) ---
    const csvPath = path.join(process.cwd(), 'public', 'LibyanSongs', 'Libyan Songs.csv');
    const file = fs.readFileSync(csvPath, 'utf8');
    const parsed = Papa.parse(file, { header: true });
    const allSongs = Array.isArray(parsed.data) ? parsed.data as LibyanSongCsvRow[] : [];
    console.log(`[API] Parsed ${allSongs.length} songs from CSV.`);

    // Find the song in CSV using the original song number (for fallback details)
    const songFromCsv = allSongs.find(row => row['Song Number'] && String(row['Song Number']).trim() === songNumberFromUrl);

    if (songFromCsv) {
        console.log(`[API] Found song in CSV for number: ${songNumberFromUrl}`);
    } else {
        console.log(`[API] Song with number ${songNumberFromUrl} not found in CSV.`);
    }

    if (!songDetailsFromDb && !songFromCsv) {
        console.error("[API] Song not found in both database and CSV for ID:", songNumberFromUrl);
         return NextResponse.json({ error: 'Song not found.' }, { status: 404 });
    }

    // Use data from DB if available, fallback to CSV for details not in DB yet
    const finalSongDetails: SupabaseSongRow | LibyanSongCsvRow | null | undefined = songDetailsFromDb || songFromCsv; // Allow null or undefined

    console.log(`[API] Final song details source: ${songDetailsFromDb ? 'Database' : songFromCsv ? 'CSV' : 'None'}`);

    // --- 3. Fetch related data from Supabase using the UUID (only if UUID is available) ---
    let comments: ApiComment[] = []; // Explicitly type comments
    let likesCount: number = 0; // Explicitly type likesCount
    let isLikedByUser: boolean = false; // Explicitly type isLikedByUser

    if (songIdUuid) { // Only proceed with Supabase fetches if we have a valid UUID
       console.log(`[API] Fetching related data from Supabase for UUID: ${songIdUuid}`);
       // Fetch comments for this song using the UUID
       const { data: fetchedComments, error: commentsError } = await supabase
         .from('comments')
         .select('id, created_at, content, user_id') // Simplified select to remove user join for now
         .eq('item_id', songIdUuid) // Use the UUID here
         .eq('item_type', 'song');

       if (commentsError) {
         console.error('[API] Error fetching comments:', commentsError.message);
         comments = []; // Ensure comments is an empty array on error
       } else if (Array.isArray(fetchedComments)) {
          // Explicitly cast to unknown first, then to ApiComment[] to satisfy TypeScript
          comments = fetchedComments as unknown as ApiComment[];
       } else {
           comments = []; // Also ensure empty array if fetchedComments is null/undefined without error
       }
       console.log(`[API] Fetched ${comments.length} comments.`);

       // Directly use likes_count from the song details fetched from DB
       likesCount = songDetailsFromDb?.likes_count ?? 0;
       console.log(`[API] Using likes_count from DB: ${likesCount}`);

       // Check if the current user has liked this song using the UUID
       const { data: userLikeData, error: userError } = await supabase.auth.getUser();
       if (userLikeData?.user) {
          console.log(`[API] Checking if user ${userLikeData.user.id} liked this song.`);
          const { data: likeData, error: checkLikeError } = await supabase
            .from('likes')
            .select('user_id')
            .eq('user_id', userLikeData.user.id)
            .eq('item_id', songIdUuid) // Use the UUID here
            .eq('item_type', 'song')
            .maybeSingle();

          if (checkLikeError) {
             console.error('[API] Error checking user like status:', checkLikeError.message);
          } else if (likeData) {
             isLikedByUser = true;
             console.log('[API] User has liked this song.');
           } else {
             isLikedByUser = false; // Explicitly set to false if no like data
             console.log('[API] User has not liked this song.');
           }
       } else {
         isLikedByUser = false; // Explicitly set to false if no user is logged in
         console.log('[API] No user logged in, isLikedByUser set to false.');
       }
       if (userError) {
          console.error('[API] Error fetching user for like check:', userError.message);
          isLikedByUser = false; // Assume not liked on error
       }

    } else {
        // If no UUID was found, log a warning and return data without Supabase interactions
        console.warn(`[API] Skipping Supabase interactions (likes, comments, trending) for song number ${songNumberFromUrl} as no UUID was found.`);
        likesCount = 0; // No likes count if no UUID
        isLikedByUser = false; // Not liked if no UUID
    }

    // --- 4. Structure the response ---
    const returnedSong: ReturnedSong = {
      id: songIdUuid,
      songName: finalSongDetails?.['Song Name'] || '',
      singerName: finalSongDetails?.Singer || finalSongDetails?.['Singer'] || '',
      category: finalSongDetails?.Category || finalSongDetails?.['Category'] || '',
      lyricsStatus: finalSongDetails?.['Lyrics Status'] || '',
      writer: finalSongDetails?.Writer || finalSongDetails?.['Writer'] || '',
      composer: finalSongDetails?.Composer || finalSongDetails?.['Composer'] || '',
      year: finalSongDetails?.Year || finalSongDetails?.['Year'] || '',
      recordingStatus: finalSongDetails?.['Recording Status'] || '',
      soundCloudLink: finalSongDetails?.['SoundCloud Link'] || '',
      views: finalSongDetails && 'Views' in finalSongDetails ? parseInt(finalSongDetails.Views.toString(), 10) || 0 : 0, // Check existence and parse
      likes_count: songIdUuid ? likesCount : (finalSongDetails && 'Likes' in finalSongDetails ? parseInt(finalSongDetails.Likes.toString(), 10) || 0 : 0), // Use Supabase count if UUID available, otherwise CSV Likes
      image: finalSongDetails?.['Image Name'] || '',
      singerImage: finalSongDetails?.['Image Name'] || '', // Use 'Image Name' from CSV for singer image filename
      sheetMusic: finalSongDetails?.['Sheet Music Name'] || '',
      lyrics: finalSongDetails?.Lyrics || 'No lyrics available.',
      comments: comments,
      isLikedByUser: isLikedByUser,
    };

    // Ensure image paths returned by the API are just filenames
    // returnedSong.image = returnedSong.image.replace('/R_Images/Singers_Images/', '');
    // returnedSong.singerImage = returnedSong.singerImage.replace('/R_Images/Singers_Images/', '');

    console.log("API returning song data:", returnedSong); // Add console log here
    console.log(`[API] Returned song ID (should be UUID if found in DB): ${returnedSong.id}`);
    console.log(`[API] Returned likes_count: ${returnedSong.likes_count}`);
    console.log(`[API] Returned isLikedByUser: ${returnedSong.isLikedByUser}`);

    // --- 5. Find similar songs (still from CSV for simplicity) ---
    const similarSongs = allSongs
      .filter((s) => s['Song Number'] && String(s['Song Number']).trim() !== songNumberFromUrl) // Filter out the current song
      .slice(0, 4) // Limit to 4 similar songs
      .map((s) => ({
        id: s['Song Number'] || '',
        songName: s['Song Name'] || '',
        singerName: s.Singer || s['Singer'] || '',
        image: s['Image Name'] || '',
        likes: s && 'Likes' in s ? parseInt(s.Likes.toString(), 10) || 0 : 0, // Check existence and parse
        views: s && 'Views' in s ? parseInt(s.Views.toString(), 10) || 0 : 0, // Check existence and parse
        lyrics: s.Lyrics || 'No lyrics available.',
      }));

    // Filter out lyrics property from similarSongs, as it's not needed for similar song display
    const similarSongsWithCorrectedImages = similarSongs.map(s => {
      const { lyrics, ...rest } = s; // Destructure to omit lyrics
      return rest;
    });

    console.log("[API] Final returned song object:", returnedSong); // Add this log

    return NextResponse.json({
      song: returnedSong,
      similarSongs: similarSongsWithCorrectedImages,
    });

  } catch (error: any) {
    console.error('[API] Error in GET request:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 