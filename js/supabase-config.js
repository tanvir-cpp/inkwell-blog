/* ==========================================================================
   Supabase Configuration
   ========================================================================== */

// Use environment variables injected via env.js (which reads from .env)
const SUPABASE_URL = window.ENV.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.ENV.SUPABASE_ANON_KEY;

// Initialize Supabase client — use window.supabaseClient to avoid conflicts
var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
