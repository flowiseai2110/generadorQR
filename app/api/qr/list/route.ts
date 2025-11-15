import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/middleware/error-handler';
import { successResponse } from '@/lib/utils/api-response';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { data, error } = await supabaseAdmin
    .from('qr_codes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    throw new Error(`Failed to fetch QR codes: ${error.message}`);
  }

  return successResponse({
    total: data.length,
    qr_codes: data,
  });
}); 