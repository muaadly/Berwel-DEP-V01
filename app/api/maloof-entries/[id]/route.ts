import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import Papa from 'papaparse';

interface MaloofEntryCsvRow {
  [key: string]: any;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const maloofCsvPath = path.join(process.cwd(), 'public', 'MaloofEntries', 'Maloof Entries.csv');
    const csvContent = await fs.readFile(maloofCsvPath, 'utf-8');

    const results = await new Promise<any>((resolve, reject) => {
      Papa.parse(csvContent, {
        header: true,
        complete: resolve,
        error: reject,
      });
    });

    const allEntries = results.data as MaloofEntryCsvRow[];
    const entry = allEntries.find((row) => row['Entry Number'] == id);

    if (!entry) {
      return NextResponse.json({ error: `Entry with id ${id} not found.` }, { status: 404 });
    }

    const returnedEntry = {
      id: entry['Entry Number'] || id,
      uuid_id: entry['uuid_id'] || '',
      entryId: entry['Entry ID'] || '',
      entryName: entry['Entry Name'] || '',
      entryType: entry['Entry Type'] || '',
      entryRhythm: entry['Entry Rhythm'] || '',
      lyrics: entry['Entry Lyrics'] || '',
      noteImage: entry['Note Image Name'] ? `/R_Images/Notes Images/${entry['Note Image Name'].replace(/\.[^/.]+$/, ".png")}` : "",
      entryImage: (() => {
        const typeImageName = entry['Type Entry Image'];
        if (!typeImageName) return "";
        const imageMap: { [key: string]: string } = {
          'ISB.PNG': 'ISB.jpeg', 'RSD.PNG': 'RSD.jpeg', 'SKA.PNG': 'SKA.png',
          'MHS.PNG': 'MHR.jpeg', 'NWA.PNG': 'NWA.jpeg', 'HSN.PNG': 'HSN.jpeg',
        };
        const imageName = imageMap[typeImageName.toUpperCase()] || typeImageName;
        const baseName = imageName.replace(/\.[^/.]+$/, '');
        const finalImageName = imageMap[typeImageName.toUpperCase()] ? imageName : `${baseName}.jpeg`;
        return `/R_Images/Entry Images/${finalImageName}`;
      })(),
      comments: [], // Comments are not in CSV
      isLikedByUser: false, // Likes are not in CSV
      likes: 0, // Likes are not in CSV
    };

    const similarEntries = allEntries
      .filter((row) => row['Entry Number'] !== id && row['Entry Type'] === entry['Entry Type'])
      .map((e) => ({
        id: e['Entry Number'] || '',
        entryName: e['Entry Name'] || '',
        entryType: e['Entry Type'] || '',
        entryRhythm: e['Entry Rhythm'] || '',
        image: (() => {
            const typeImageName = e['Type Entry Image'];
            if (!typeImageName) return "/placeholder.svg";
            const imageMap: { [key: string]: string } = {
              'ISB.PNG': 'ISB.jpeg', 'RSD.PNG': 'RSD.jpeg', 'SKA.PNG': 'SKA.png',
              'MHS.PNG': 'MHR.jpeg', 'NWA.PNG': 'NWA.jpeg', 'HSN.PNG': 'HSN.jpeg',
            };
            const imageName = imageMap[typeImageName.toUpperCase()] || typeImageName;
            const baseName = imageName.replace(/\.[^/.]+$/, '');
            const finalImageName = imageMap[typeImageName.toUpperCase()] ? imageName : `${baseName}.jpeg`;
            return `/R_Images/Entry Images/${finalImageName}`;
        })(),
      }));

    return NextResponse.json({ entry: returnedEntry, similarEntries });

  } catch (error: any) {
    console.error("Error fetching Maloof entry details:", error);
    return NextResponse.json({ error: 'Failed to load entry details.', details: error.message }, { status: 500 });
  }
} 