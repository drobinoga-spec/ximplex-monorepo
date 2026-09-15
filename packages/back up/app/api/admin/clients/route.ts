import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(request: NextRequest) {
  try {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) throw profilesError;

    const clients = (profiles || []).map((profile, index) => ({
      id: index + 1,
      nombre: profile.full_name || profile.email?.split('@')[0] || 'Sin nombre',
      plan: profile.subscription_plan || 'Free',
      mrr: profile.subscription_plan === 'Pro' ? 29 : 0,
      performance: Math.floor(Math.random() * 20 + 80),
      createdAt: new Date(profile.created_at).toISOString().split('T')[0],
    }));

    return NextResponse.json({
      success: true,
      data: clients,
      count: clients.length
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}