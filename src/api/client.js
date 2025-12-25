import { createClient } from "@supabase/supabase-js";

if (process.env.NODE_ENV !== 'production') {
    console.log('NEXT_PUBLIC_SUPABASE_URL type:', typeof process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY type:', typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default client;
