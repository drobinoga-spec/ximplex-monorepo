const twilio = require('twilio');

// Credenciales de Twilio - usar variables de entorno
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKeySid = process.env.TWILIO_API_KEY_SID;
const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || '+17372508034';

// Inicializar cliente de Twilio
const client = twilio(apiKeySid, apiKeySecret, { accountSid });

// Tu número de WhatsApp
const yourNumber = process.env.USER_WHATSAPP_NUMBER || '+50686994672';

console.log('🚀 Enviando mensaje de prueba a WhatsApp...');
console.log(`Número destino: ${yourNumber}`);

const messageBody = `✅ Formix WhatsApp Integration Test\n\n🎉 ¡El envío de mensajes está funcionando!\n\nEsta es una prueba desde Formix.`;

client.messages.create({
  from: `whatsapp:${twilioWhatsAppNumber}`,
  to: `whatsapp:${yourNumber}`,
  body: messageBody,
})
.then(message => {
  console.log('✅ Mensaje enviado exitosamente!');
  console.log(`SID del mensaje: ${message.sid}`);
})
.catch(error => {
  console.error('❌ Error al enviar el mensaje:');
  console.error(error.message);
});
