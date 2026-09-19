import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKeySid = process.env.TWILIO_API_KEY_SID;
const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;

// Validate environment variables
if (!accountSid || !apiKeySid || !apiKeySecret || !twilioWhatsAppNumber) {
  console.warn('Twilio credentials not fully configured');
}

// Initialize Twilio client with API Key authentication
const client = twilio(apiKeySid, apiKeySecret, { accountSid });

export async function sendWhatsAppNotification(
  recipientPhone: string,
  formName: string,
  formData: Record<string, any>
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Format phone number if needed
    let formattedPhone = recipientPhone;
    if (!formattedPhone.startsWith('whatsapp:')) {
      formattedPhone = `whatsapp:${formattedPhone}`;
    }

    // Build message body
    const dataString = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const messageBody = `🚨 *Nuevo Lead - ${formName}*\n\n${dataString}\n\n_Formix_`;

    // Send message via Twilio
    const message = await client.messages.create({
      from: `whatsapp:${twilioWhatsAppNumber}`,
      to: formattedPhone,
      body: messageBody,
    });

    return {
      success: true,
      messageId: message.sid,
    };
  } catch (error: any) {
    console.error('Twilio error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send WhatsApp message',
    };
  }
}