interface MaloofEntryCsvRow {
  'Entry ID': string;
  'Entry Number': string;
  'Entry Name': string;
  'Entry Type': string;
  'Entry Rhythm': string;
  'Entry Lyrics': string;
  'Note Image Name': string;
  'Type Entry Image': string;
  'uuid_id': string; // Only if used in code, otherwise remove
  [key: string]: any; // Add index signature to allow dynamic access
} 