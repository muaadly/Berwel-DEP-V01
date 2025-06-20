import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    console.log("API received Maloof Entry ID:", id);

    // --- Fetch data from Supabase ---
    const supabase = await createClient();

    // Log column names for debugging
    const { data: allRows, error: allRowsError } = await supabase
      .from('maloof_entries')
      .select('*')
      .limit(1);
    if (allRows && allRows.length > 0) {
      console.log('First row column names:', Object.keys(allRows[0]));
    } else {
      console.log('No rows found in maloof_entries or error:', allRowsError);
    }

    // Try with 'Entry Number' (original)
    let { data: entry, error: entryError } = await supabase
      .from('maloof_entries')
      .select('*')
      .eq('Entry Number', Number(id))
      .single();

    // If not found, try with 'entry_number'
    if (entryError || !entry) {
      console.log("Trying with 'entry_number' column...");
      const { data: entry2, error: entryError2 } = await supabase
        .from('maloof_entries')
        .select('*')
        .eq('entry_number', Number(id))
        .single();
      entry = entry2;
      entryError = entryError2;
    }

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
      id: entry['Entry Number'] || entry['entry_number'] || id,
      uuid_id: entry['uuid_id'] || '',
      entryId: entry['Entry ID'] || entry['entry_id'] || '',
      entryName: entry['Entry Name'] || entry['entry_name'] || '',
      entryType: entry['Entry Type'] || entry['entry_type'] || '',
      entryRhythm: entry['Entry Rhythm'] || entry['entry_rhythm'] || '',
      lyrics: entry['Entry Lyrics'] || entry['entry_lyrics'] || '',
      noteImage: entry['Note Image Name'] || entry['note_image_name']
        ? `/R_Images/Notes Images/${(entry['Note Image Name'] || entry['note_image_name']).replace(/\.[^/.]+$/, ".png")}` : "",
      entryImage: (() => {
        const typeImageName = entry['Type Entry Image'] || entry['type_entry_image'];
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
      .eq('Entry Type', entry['Entry Type'] || entry['entry_type'])
      .neq('Entry Number', entry['Entry Number'] || entry['entry_number']);

    const similarEntries = (similarEntriesRaw || []).map((e: any) => ({
      id: e['Entry Number'] || e['entry_number'] || '',
      entryId: e['Entry ID'] || e['entry_id'] || '',
      entryName: e['Entry Name'] || e['entry_name'] || '',
      entryType: e['Entry Type'] || e['entry_type'] || '',
      entryRhythm: e['Entry Rhythm'] || e['entry_rhythm'] || '',
      typeEntryImage: (() => {
        const typeImageName = e['Type Entry Image'] || e['type_entry_image'];
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