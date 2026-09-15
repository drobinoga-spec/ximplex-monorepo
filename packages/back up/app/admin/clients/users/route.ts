import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@/app/api/auth/[...nextauth]/route';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Verificar si es admin
    const { data: user } = await supabase
      .from('users')
      .select('id, is_super_admin')
      .eq('email', session.user.email)
      .single();

    if (!user?.is_super_admin) {
      return NextResponse.json(
        { error: 'No tienes permisos de admin' },
        { status: 403 }
      );
    }

    // Obtener todos los usuarios
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, company_name, subscription_plan, subscription_status, created_at, leads_used_this_month')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Verificar si es admin
    const { data: adminUser } = await supabase
      .from('users')
      .select('is_super_admin')
      .eq('email', session.user.email)
      .single();

    if (!adminUser?.is_super_admin) {
      return NextResponse.json(
        { error: 'No tienes permisos de admin' },
        { status: 403 }
      );
    }

    const { userId, subscription_plan, subscription_status } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID es requerido' },
        { status: 400 }
      );
    }

    // Actualizar usuario
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        subscription_plan: subscription_plan || undefined,
        subscription_status: subscription_status || undefined,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}