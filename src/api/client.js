import { createBrowserClient } from "@supabase/ssr";

if (process.env.NODE_ENV !== 'production') {
    console.log('NEXT_PUBLIC_SUPABASE_URL type:', typeof process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY type:', typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default client;
