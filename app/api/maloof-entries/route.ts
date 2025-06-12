import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import Papa from 'papaparse';
import { MaloofEntry } from '@/app/library/page';

export async function GET(request: Request) {
  try {
    // Construct the path to the Maloof Entries CSV file
    const maloofCsvPath = path.join(process.cwd(), 'public', 'MaloofEntries', 'Maloof Entries.csv');

    // Read the CSV file content
    const csvContent = await fs.readFile(maloofCsvPath, 'utf-8');

    // Parse the CSV content
    return new Promise((resolve, reject) => {
      Papa.parse(csvContent, {
        header: true,
        complete: (results) => {
          // Filter out any rows that might be empty or contain only headers and map to MaloofEntry interface
          const entries: MaloofEntry[] = results.data
            .filter((entry: any) => entry['Entry Name'])
            .map((entry: any, index: number) => ({
              number: entry['Entry Number'] || index + 1, // Use 'Entry Number' from CSV or index+1
              'Entry Name': entry['Entry Name'] || '',
              'Entry Type': entry['Entry Type'] || '',
              'Entry Rhythm': entry['Entry Rhythm'] || '',
              'Entry Audio File': entry['Entry Audio File'] || '',
              'Entry Image': entry['Entry Image'] || '',
              'Notes Audio File': entry['Notes Audio File'] || '',
              'Notes Image': entry['Notes Image'] || '',
              id: entry['Entry Number'] || index + 1, // Use number as id
              entryName: entry['Entry Name'] || '',
              entryType: entry['Entry Type'] || '',
              entryRhythm: entry['Entry Rhythm'] || '',
              composer: entry['Composer'] || 'Unknown', // Assuming 'Composer' column exists, otherwise 'Unknown'
              origin: entry['Origin'] || 'Unknown', // Assuming 'Origin' column exists, otherwise 'Unknown'
              period: entry['Period'] || 'Unknown', // Assuming 'Period' column exists, otherwise 'Unknown'
              recordingStatus: entry['Recording Status'] || 'Unknown', // Assuming 'Recording Status' column exists
              soundCloudLink: entry['SoundCloud Link'] || '', // Assuming 'SoundCloud Link' column exists
              views: parseInt(entry['Views'] || '0', 10), // Assuming 'Views' column exists, parse as integer
              likes: parseInt(entry['Likes'] || '0', 10), // Assuming 'Likes' column exists, parse as integer
              image: entry['Entry Image'] || '', // Use Entry Image for general image
              lyrics: entry['Lyrics'] || 'No lyrics available.', // Assuming 'Lyrics' column exists
              notes: entry['Notes'] || 'No notes available.', // Assuming 'Notes' column exists
              comments: [], // Assuming comments are not in CSV, initialize as empty array
            }));
          resolve(NextResponse.json({ entries }));
        },
        error: (err: any) => {
          reject(err);
        },
      });
    });

  } catch (error) {
    console.error("Error reading or parsing Maloof CSV file:", error);
    return NextResponse.json(
      { error: 'Failed to load Maloof entries.' },
      { status: 500 }
    );
  }
} 