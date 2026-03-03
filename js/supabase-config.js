/* ==========================================================================
   Supabase Configuration
   ========================================================================== */

const SUPABASE_URL = 'https://wwzzafzgaelrcgfjarth.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3enphZnpnYWVscmNnZmphcnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NTkxMzEsImV4cCI6MjA4ODEzNTEzMX0.LBh7LPliaJ3y-oQglW7wiCnZlV3PqoQgdTqg6GlbGOA';

// Initialize Supabase client — use window.supabaseClient to avoid conflicts
var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
