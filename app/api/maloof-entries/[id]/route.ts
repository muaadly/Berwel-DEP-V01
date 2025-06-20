import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    console.log("API received Maloof Entry ID:", id);

    // --- Fetch data from Supabase ---
    const supabase = await createClient();

    // Fetch the Maloof entry by Entry Number
    const { data: entry, error: entryError } = await supabase
      .from('maloof_entries')
      .select('*')
      .eq('Entry Number', id)
      .single();

    if (entryError || !entry) {
      console.error('Error fetching Maloof entry from database:', entryError);
      return NextResponse.json({ error: `Entry with id ${id} not found in database.`, details: entryError?.message }, { status: 404 });
    }

    // Fetch comments for this entry
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('id, created_at, content, user_id')
      .eq('item_id', entry.uuid_id)
      .eq('item_type', 'maloof');

    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
    }

    // --- Prepare returned entry ---
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
        type ImageMap = { [key: string]: string };
        const imageMap: ImageMap = {
          'ISB.PNG': 'ISB.jpeg',
          'RSD.PNG': 'RSD.jpeg',
          'SKA.PNG': 'SKA.png',
          'MHS.PNG': 'MHR.jpeg',
          'NWA.PNG': 'NWA.jpeg',
          'HSN.PNG': 'HSN.jpeg',
        };
        const imageName = imageMap[typeImageName.toUpperCase()] || typeImageName;
        const baseName = imageName.replace(/\.[^/.]+$/, '');
        const finalImageName = imageMap[typeImageName.toUpperCase()] ? imageName : `${baseName}.jpeg`;
        return `/R_Images/Entry Images/${finalImageName}`;
      })(),
      comments: comments || [],
    };
    console.log("API returning entry data:", returnedEntry);
    console.log("API returning noteImage path:", returnedEntry.noteImage);

    // Find similar entries based on Entry Type (example logic, adjust as needed)
    const { data: similarEntriesRaw, error: similarError } = await supabase
      .from('maloof_entries')
      .select('*')
      .eq('Entry Type', entry['Entry Type'])
      .neq('Entry Number', id);

    const similarEntries = (similarEntriesRaw || []).map((e: any) => ({
      id: e['Entry Number'] || '',
      entryId: e['Entry ID'] || '',
      entryName: e['Entry Name'] || '',
      entryType: e['Entry Type'] || '',
      entryRhythm: e['Entry Rhythm'] || '',
      typeEntryImage: (() => {
        const typeImageName = e['Type Entry Image'];
        if (!typeImageName) return "";
        type ImageMap = { [key: string]: string };
        const imageMap: ImageMap = {
          'ISB.PNG': 'ISB.jpeg',
          'RSD.PNG': 'RSD.jpeg',
          'SKA.PNG': 'SKA.png',
          'MHS.PNG': 'MHR.jpeg',
          'NWA.PNG': 'NWA.jpeg',
          'HSN.PNG': 'HSN.jpeg',
        };
        const imageName = imageMap[typeImageName.toUpperCase()] || typeImageName;
        const baseName = imageName.replace(/\.[^/.]+$/, '');
        const finalImageName = imageMap[typeImageName.toUpperCase()] ? imageName : `${baseName}.jpeg`;
        return `/R_Images/Entry Images/${finalImageName}`;
      })(),
    }));

    return NextResponse.json({ entry: returnedEntry, similarEntries });

  } catch (error: any) {
    console.error("Error fetching maloof entry details:", error);
    return NextResponse.json({ error: 'Failed to load entry.', details: error.message }, { status: 500 });
  }
} 