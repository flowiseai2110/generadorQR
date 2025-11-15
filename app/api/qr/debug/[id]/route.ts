import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Buscar por ID
  const { data: byId, error: errorById } = await supabaseAdmin
    .from('qr_codes')
    .select('*')
    .eq('id', 'vtK75zqX')
    .single();

  // Buscar por short_code
  const { data: byShortCode, error: errorByShortCode } = await supabaseAdmin
    .from('qr_codes')
    .select('*')
    .eq('short_code', 'vtK75zqX')
    .single();

  return NextResponse.json({
    searched_for: id,
    found_by_id: byId || null,
    error_by_id: errorById?.message || null,
    found_by_short_code: byShortCode || null,
    error_by_short_code: errorByShortCode?.message || null,
  });
} 
// http://localhost:3000/api/qr/debug/TU_QR_ID_O_SHORT_CODE