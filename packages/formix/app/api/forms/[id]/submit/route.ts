import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { sendWhatsAppNotification } from '@/lib/twilio';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: formId } = await params;
    const body = await req.json();
    const { data: formData } = body;

    if (!formData || Object.keys(formData).length === 0) {
      return NextResponse.json(
        { error: 'Form data is required' },
        { status: 400 }
      );
    }

    // Verify form exists and get owner info
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('id, user_id, name')
      .eq('id', formId)
      .single();

    if (formError || !form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    // ===== NUEVA LÓGICA: Verificar límites =====
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_plan, whatsapp_phone')
      .eq('user_id', form.user_id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Si es plan free, verificar límite de 20 mensajes por mes
    if (profile.subscription_plan === 'free') {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const { count, error: countError } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('form_id', formId)
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());

      if (!countError && count !== null && count >= 20) {
        return NextResponse.json(
          { 
            error: 'Monthly message limit reached',
            limit_reached: true,
            message: 'You have reached your free plan limit of 20 messages per month. Please upgrade to continue.'
          },
          { status: 429 }
        );
      }
    }
    // ===== FIN LÓGICA DE LÍMITES =====

    // Save lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert([
        {
          form_id: formId,
          data: formData,
          whatsapp_sent: false,
        },
      ])
      .select()
      .single();

    if (leadError) {
      console.error('Supabase error:', leadError);
      return NextResponse.json(
        { error: 'Failed to save lead' },
        { status: 500 }
      );
    }

    // Send WhatsApp notification if number is configured
    let whatsappSent = false;
    if (profile.whatsapp_phone) {
      const result = await sendWhatsAppNotification(
        profile.whatsapp_phone,
        form.name,
        formData
      );

      if (result.success) {
        whatsappSent = true;

        // Update lead to mark whatsapp as sent
        await supabase
          .from('leads')
          .update({ whatsapp_sent: true })
          .eq('id', lead.id);
      }
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Lead received successfully',
      whatsappSent,
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}