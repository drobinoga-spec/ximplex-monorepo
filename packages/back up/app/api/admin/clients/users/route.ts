import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(request: NextRequest) {
  try {
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) throw usersError;

    const { data: profiles } = await supabase
      .from('profiles')
      .select('*');

    const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

    const usuariosData = (users || []).map((user, index) => {
      const profile = profileMap.get(user.id);
      return {
        id: index + 1,
        email: user.email || '',
        nombre: profile?.full_name || user.user_metadata?.name || 'Sin nombre',
        plan: profile?.subscription_plan || 'Free',
        estado: user.user_metadata?.status || 'activo',
        apps: 1,
        createdAt: new Date(user.created_at).toISOString().split('T')[0],
        lastLogin: user.last_sign_in_at
          ? new Date(user.last_sign_in_at).toISOString().split('T')[0]
          : new Date(user.created_at).toISOString().split('T')[0],
      };
    });

    return NextResponse.json({
      success: true,
      data: usuariosData,
      count: usuariosData.length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}