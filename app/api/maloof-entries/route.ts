import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { MaloofEntry } from '@/app/library/page';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('maloof_entries')
      .select('*')
      .order('Entry Number', { ascending: true });

    if (error) {
      console.error("Error fetching Maloof entries from Supabase:", error);
      throw error;
    }

    const entries: MaloofEntry[] = data.map((entry: any) => {
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
        views: entry['Views'] || 0,
        likes: entry['Likes'] || 0,
        image: entry['Type Entry Image'] ? `/R_Images/Entry Images/${entry['Type Entry Image'].replace('.PNG', '.jpeg')}` : '/placeholder.svg',
        lyrics: entry['Entry Lyrics'] || 'No lyrics available.',
        notes: entry['Notes'] || 'No notes available.',
        comments: [],
      };

      // Ensure all properties from MaloofEntry are present, even if undefined
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

    return NextResponse.json({ entries });

  } catch (error) {
    console.error("Error in GET /api/maloof-entries:", error);
    return NextResponse.json(
      { error: 'Failed to load Maloof entries.' },
      { status: 500 }
    );
  }
} 