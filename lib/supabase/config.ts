const DEFAULT_SUPABASE_URL = "https://tvoeeeggjypptlblyuyr.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_JD0HVLOqpZSKnU4IKYOy9w_rOhjQAVb";

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL,
  publishableKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY,
};
