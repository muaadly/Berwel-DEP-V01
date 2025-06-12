import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { createClient } from '@/utils/supabase/server'; // Import the server-side Supabase client

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), 'public', 'LibyanSongs', 'Libyan Songs.csv');
    const file = fs.readFileSync(csvPath, 'utf8');
    const parsed = Papa.parse(file, { header: true });

    // Create Supabase client
    const supabase = await createClient();

    // Fetch trending likes for songs from Supabase
    const { data: trendingData, error: trendingError } = await supabase
      .from('trending')
      .select('item_id, likes_count')
      .eq('item_type', 'song');

    if (trendingError) {
      console.error('Error fetching trending data:', trendingError);
      // Decide how to handle this error - maybe log and proceed with CSV likes
    }

    // Create a map for easy lookup of likes by song ID
    const trendingLikesMap = new Map<string, number>();
    if (trendingData) {
      trendingData.forEach(item => {
        trendingLikesMap.set(item.item_id, item.likes_count);
      });
    }

    // Map to only the relevant columns for the frontend table
    const songs = parsed.data.map((row: any, idx: number) => {
      const soundCloudLink = row['SoundCloud Link'] || '';
      const songNumber = String(row['Song Number']).trim();
      const likesCount = trendingLikesMap.get(songNumber) ?? 0; // Get likes or default to 0

      if (idx < 5) { // Log for the first 5 songs to avoid excessive output
        console.log(`Song ${idx + 1} - SoundCloud Link: ${soundCloudLink}, Likes: ${likesCount}`);
      }
      return ({
        number: row['Song Number'] || idx + 1,
        name: row['Song Name'] || '',
        singer: row['Singer'] || '',
        category: row['Category'] || '',
        play: soundCloudLink,
        imageName: row['Image Name'] ? `/R_Images/Singers_Images/${row['Image Name']}` : '',
        likes: likesCount, // Assign the fetched likes count
      });
    });

    // Extract unique singers with their image names
    const singersMap = new Map<string, { name: string, imageName: string }>();
    songs.forEach(song => {
      if (song.singer && song.imageName && !singersMap.has(song.singer)) {
        singersMap.set(song.singer, { name: song.singer, imageName: song.imageName });
      }
    });
    const uniqueSingers = Array.from(singersMap.values());

    // Extract unique categories
    const uniqueCategories = Array.from(new Set(songs.map(song => song.category).filter(category => category !== '')));

    return NextResponse.json({ songs, uniqueSingers, uniqueCategories });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load songs.' }, { status: 500 });
  }
} 