/**
 * Re-export de supabaseAdmin para mayor claridad semántica
 * Usar este import en API Routes:
 * import { createClient } from '@/lib/supabase/server';
 */
export { supabaseAdmin as createClient } from './admin';