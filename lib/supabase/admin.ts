import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase Admin environment variables');
}

/**
 * Cliente Supabase con service role key
 * ⚠️ SOLO USAR EN EL SERVIDOR (API Routes)
 * ✅ Tiene permisos de administrador
 * ✅ Bypass de Row Level Security (RLS)
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});