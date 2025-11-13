import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase-admin';
import { withErrorHandler } from '@/lib/middleware/error-handler';
import { successResponse } from '@/lib/utils/api-response';

export const GET = withErrorHandler(async (request: NextRequest) => {
  // Test 1: Contar tablas
  const { data: templates, error: templatesError } = await supabaseAdmin
    .from('templates')
    .select('*');

  if (templatesError) {
    throw new Error(`Database error: ${templatesError.message}`);
  }

  // Test 2: Insertar un cliente de prueba
  const { data: testClient, error: insertError } = await supabaseAdmin
    .from('clients')
    .insert({
      name: 'Test Client',
      email: 'test@example.com',
      phone: '+51999999999',
    })
    .select()
    .single();

  if (insertError) {
    throw new Error(`Insert error: ${insertError.message}`);
  }

  return successResponse({
    message: 'Database connection successful!',
    templates_count: templates?.length || 0,
    templates: templates,
    test_client: testClient,
  });
});