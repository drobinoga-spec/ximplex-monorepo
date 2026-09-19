import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, company_name, whatsapp_phone, business_name, business_description, delivery_method } = await req.json();

    // Get user ID from email
    const { data: user } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (name) updateData.name = name;
    if (company_name) updateData.company_name = company_name;
    if (whatsapp_phone) updateData.whatsapp_phone = whatsapp_phone;
    if (business_name) updateData.business_name = business_name;
    if (business_description) updateData.business_description = business_description;
    if (delivery_method) updateData.delivery_method = delivery_method;

    // Update profile
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Could not update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Profile updated successfully', user: data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}