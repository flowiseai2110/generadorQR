import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Cliente Supabase con anon key
 * ✅ USAR EN COMPONENTES REACT (cliente/navegador)
 * ⚠️ Respeta Row Level Security (RLS)
 * ⚠️ Requiere autenticación para operaciones protegidas
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);