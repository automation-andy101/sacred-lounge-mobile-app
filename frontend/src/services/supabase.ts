import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getAudioUrl = (filename: string) => {
  const { data } = supabase.storage
    .from('sacred-lounge-mp3s')
    .getPublicUrl(filename);
  return data.publicUrl;
};

