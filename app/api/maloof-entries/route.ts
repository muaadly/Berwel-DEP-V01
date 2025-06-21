import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import Papa from 'papaparse';
import { MaloofEntry } from '@/app/library/page';

export async function GET(request: Request) {
  try {
    const maloofCsvPath = path.join(process.cwd(), 'public', 'MaloofEntries', 'Maloof Entries.csv');
    const csvContent = await fs.readFile(maloofCsvPath, 'utf-8');

    return new Promise((resolve, reject) => {
      Papa.parse(csvContent, {
        header: true,
        complete: (results) => {
          const entries: MaloofEntry[] = results.data
            .filter((entry: any) => entry && entry['Entry Number'] && entry['Entry Name'])
            .map((entry: any) => {
              const mappedEntry: any = {
                id: entry['Entry Number'],
                number: entry['Entry Number'],
                entryName: entry['Entry Name'],
                entryType: entry['Entry Type'],
                entryRhythm: entry['Entry Rhythm'],
                composer: entry['Composer'] || 'Unknown',
                origin: entry['Origin'] || 'Unknown',
                period: entry['Period'] || 'Unknown',
                recordingStatus: entry['Recording Status'] || 'Unknown',
                soundCloudLink: entry['SoundCloud Link'] || '',
                views: parseInt(entry['Views'] || '0', 10),
                likes: parseInt(entry['Likes'] || '0', 10),
                image: entry['Type Entry Image'] ? `/R_Images/Entry Images/${entry['Type Entry Image'].replace('.PNG', '.jpeg')}` : '/placeholder.svg',
                lyrics: entry['Entry Lyrics'] || 'No lyrics available.',
                notes: entry['Notes'] || 'No notes available.',
                comments: [],
              };
              const finalEntry: MaloofEntry = {
                ...mappedEntry,
                'Entry Name': mappedEntry.entryName,
                'Entry Type': mappedEntry.entryType,
                'Entry Rhythm': mappedEntry.entryRhythm,
                'Entry Audio File': entry['Entry Audio File'] || '',
                'Entry Image': mappedEntry.image,
                'Notes Audio File': entry['Notes Audio File'] || '',
                'Notes Image': entry['Notes Image'] || '',
              };
              return finalEntry;
            });
          resolve(NextResponse.json({ entries }));
        },
        error: (err: any) => {
          console.error("Error parsing Maloof CSV:", err);
          reject(new Response(JSON.stringify({ error: 'Failed to parse Maloof entries.' }), { status: 500 }));
        },
      });
    });

  } catch (error) {
    console.error("Error reading Maloof CSV file:", error);
    return NextResponse.json(
      { error: 'Failed to load Maloof entries.' },
      { status: 500 }
    );
  }
} 