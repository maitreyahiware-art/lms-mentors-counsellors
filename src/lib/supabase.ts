import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rdufqyorwprqxhwjqrrr.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkdWZxeW9yd3BycXhod2pxcnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MDIxNDcsImV4cCI6MjA4NjI3ODE0N30.SN_NmQzG_0jx29J905oqoBhpCKA5n3Wy_7HjyxlgjFk';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkdWZxeW9yd3BycXhod2pxcnJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDcwMjE0NywiZXhwIjoyMDg2Mjc4MTQ3fQ.D7n6B41v_43T0Ny6ICp2q9nwhZzzgRoIssCk1EwMCuM';

// Standard client (Anon access)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (Bypasses RLS - use only for server-side auth/admin tasks)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

