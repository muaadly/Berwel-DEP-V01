import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { createClient } from '@/utils/supabase/server'; // Import the server-side Supabase client

// Define the interface for the data structure in the Maloof Entries CSV
interface MaloofEntryCsvRow {
  'Entry Number': string;
  'Entry Name': string;
  'Entry Type': string;
  'Entry Rhythm': string;
  'Composer': string;
  'Origin': string;
  'Period': string;
  'Recording Status': string;
  'SoundCloud Link': string;
  'Views': string;
  'Likes': string; // Keep likes in CSV for now, will sync later or use Supabase count
  'Entry Image': string;
  'Type Entry Image': string;
  'Note Image Name': string;
  'Entry Lyrics': string;
  'Notes': string;
  // Add any other columns from your Maloof Entries CSV here
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    console.log("API received Maloof Entry ID:", id);

    // --- Fetch data from CSV ---
    const csvPath = path.join(process.cwd(), 'public', 'MaloofEntries', 'Maloof Entries.csv');
    let file;
    try {
      file = fs.readFileSync(csvPath, 'utf8');
    } catch (e) {
      console.error('Failed to read Maloof Entries CSV:', e);
      return NextResponse.json({ error: 'Failed to read Maloof Entries CSV', details: e.message }, { status: 500 });
    }
    let parsed;
    try {
      parsed = Papa.parse(file, { header: true });
      console.log('PapaParse output:', parsed);
    } catch (e) {
      console.error('Failed to parse Maloof Entries CSV:', e);
      return NextResponse.json({ error: 'Failed to parse Maloof Entries CSV', details: e.message }, { status: 500 });
    }
    if (!Array.isArray(parsed.data)) {
      console.error('Parsed CSV data is not an array:', parsed.data, 'Full PapaParse output:', parsed);
      return NextResponse.json({ error: 'Parsed CSV data is not an array', details: JSON.stringify(parsed) }, { status: 500 });
    }
    const allEntries = parsed.data as MaloofEntryCsvRow[];
    const entry = allEntries.find((row) => row['Entry Number'] && String(row['Entry Number']).trim() === String(id).trim());
    if (!entry) {
      console.error(`Entry with id ${id} not found in Maloof Entries CSV.`);
      return NextResponse.json({ error: `Entry with id ${id} not found in Maloof Entries CSV.` }, { status: 404 });
    }

    // --- Fetch data from Supabase ---
    const supabase = createClient();

    // Fetch comments for this entry
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('id, created_at, content, user_id')
      .eq('item_id', id)
      .eq('item_type', 'maloof');

    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
      // Decide how to handle errors
    }

    // Corrected: Fetch like count for this entry
    const { count: likesCount, error: likesCountError } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true }) // Corrected select for count
      .eq('item_id', id)
      .eq('item_type', 'maloof');

     if (likesCountError) {
      console.error('Error fetching likes count:', likesCountError);
      // Handle error
    }

    // Check if the current user has liked this entry
    let isLikedByUser = false;
    let userLikeData = null;
    let userError = null;
    try {
      const userResult = await supabase.auth.getUser();
      userLikeData = userResult.data;
      userError = userResult.error;
    } catch (e) {
      userError = e;
    }
    if (userLikeData && userLikeData.user) {
      try {
        const { data: likeData, error: checkLikeError } = await supabase
          .from('likes')
          .select('id')
          .eq('user_id', userLikeData.user.id)
          .eq('item_id', id)
          .eq('item_type', 'maloof')
          .maybeSingle();
        if (!checkLikeError && likeData) {
          isLikedByUser = true;
        }
      } catch (e) {
        // Ignore like check errors if user is present
      }
    } else {
      isLikedByUser = false; // No user session, not liked by user
    }
    if (userError) {
      console.error('Error fetching user for like check:', userError);
      // Do not throw, just log
    }

    // --- Combine CSV and Supabase data ---
    const returnedEntry = {
      id: entry['Entry Number'] || id,
      entryName: entry['Entry Name'] || '',
      entryType: entry['Entry Type'] || '',
      entryRhythm: entry['Entry Rhythm'] || '',
      composer: entry['Composer'] || 'Unknown',
      origin: entry['Origin'] || 'Unknown',
      period: entry['Period'] || 'Unknown',
      recordingStatus: entry['Recording Status'] || 'Unknown',
      soundCloudLink: entry['SoundCloud Link'] || '',
      views: parseInt(entry['Views'] || '0', 10),
      // Use the count from Supabase for likes
      likes: likesCount ?? parseInt(entry['Likes'] || '0', 10), // Use Supabase count if available, fallback to CSV
      image: entry['Entry Image'] || '',
      entryImage: (() => {
        const typeImageName = entry['Type Entry Image'];
        if (!typeImageName) return "";
        const imageMap: { [key: string]: string } = {
          'ISB.PNG': 'ISB.jpeg',
          'RSD.PNG': 'RSD.jpeg',
          'SKA.PNG': 'SKA.png',
          'MHS.PNG': 'MHR.jpeg',
          'NWA.PNG': 'NWA.jpeg',
          'HSN.PNG': 'HSN.jpeg',
        };
        const imageName = imageMap[typeImageName.toUpperCase()] || typeImageName;
        const fileExtension = imageName.split('.').pop() || '';
        const baseName = imageName.replace(/\.[^/.]+$/, '');
        
        const finalImageName = imageMap[typeImageName.toUpperCase()] ? imageName : `${baseName}.jpeg`;

        return `/R_Images/Entry Images/${finalImageName}`;
      })(),
      noteImage: entry['Note Image Name'] ? `/R_Images/Notes Images/${entry['Note Image Name'].replace(/\.[^/.]+$/, ".png")}` : "",
      lyrics: entry['Entry Lyrics'] || 'No lyrics available.',
      notes: entry['Notes'] || 'No notes available.',
      // Include fetched comments and user like status
      comments: comments || [], // Provide an empty array if fetching failed
      isLikedByUser: isLikedByUser,
    };
    console.log("API returning entry data:", returnedEntry);
    console.log("API returning noteImage path:", returnedEntry.noteImage);

    // Find similar entries based on Entry Type (example logic, adjust as needed)
    const similarEntries = allEntries.filter((row) =>
      row['Entry Number'] && String(row['Entry Number']).trim() !== String(id).trim() && row['Entry Type'] === entry['Entry Type']
    ).map((e) => ({
      id: e['Entry Number'] || '',
      entryName: e['Entry Name'] || '',
      entryType: e['Entry Type'] || '',
      image: (() => {
        const typeImageName = e['Type Entry Image'];
        if (!typeImageName) return "";
        const imageMap: { [key: string]: string } = {
          'ISB.PNG': 'ISB.jpeg',
          'RSD.PNG': 'RSD.jpeg',
          'SKA.PNG': 'SKA.png',
          'MHS.PNG': 'MHR.jpeg',
          'NWA.PNG': 'NWA.jpeg',
          'HSN.PNG': 'HSN.jpeg',
        };
        const imageName = imageMap[typeImageName.toUpperCase()] || typeImageName;
         const fileExtension = imageName.split('.').pop() || '';
        const baseName = imageName.replace(/\.[^/.]+$/, '');
        
        const finalImageName = imageMap[typeImageName.toUpperCase()] ? imageName : `${baseName}.jpeg`;

        return `/R_Images/Entry Images/${finalImageName}`;
      })(),
      likes: parseInt(e['Likes'] || '0', 10), // Still using CSV likes for similar entries for simplicity here
    }));

    return NextResponse.json({ entry: returnedEntry, similarEntries });

  } catch (error: any) {
    console.error("Error fetching maloof entry details:", error);
    return NextResponse.json({ error: 'Failed to load entry.', details: error.message }, { status: 500 });
  }
} 