const twilio = require('twilio');

// Credenciales de Twilio
const accountSid = 'AC0d3590950130b4836a6b7e47462d3e51';
const apiKeySid = 'SKac67cf800cd247ae9511bf03f02d69f6';
const apiKeySecret = 'owKUc87UHRKTiUQIVPhrF6EKM2rqIi7M';
const twilioWhatsAppNumber = '+17372508034';

// Inicializar cliente de Twilio
const client = twilio(apiKeySid, apiKeySecret, { accountSid });

// Tu número de WhatsApp
const yourNumber = '+50686994672';

console.log('🚀 Enviando mensaje de prueba a WhatsApp...');
console.log(`Número destino: ${yourNumber}`);

const messageBody = `✅ Formix WhatsApp Integration Test\n\n🎉 ¡El envío de mensajes está funcionando!\n\nEsta es una prueba desde Formix.`;

client.messages.create({
  from: `whatsapp:${twilioWhatsAppNumber}`,
  to: `whatsapp:${yourNumber}`,
  body: messageBody,
})
.then(message => {
  console.log('\n✅ ¡ÉXITO! Mensaje enviado correctamente');
  console.log(`Message SID: ${message.sid}`);
  console.log('\n📱 Deberías recibir el mensaje en tu WhatsApp en unos segundos...');
  process.exit(0);
})
.catch(error => {
  console.error('\n❌ Error al enviar mensaje:');
  console.error('Código:', error.code);
  console.error('Mensaje:', error.message);

  // Si el error es ContentSid, podría ser un problema de credenciales
  if (error.message.includes('ContentSid')) {
    console.error('\n💡 Solución: Verifica que:');
    console.error('   - Las credenciales de Twilio son correctas');
    console.error('   - El número de WhatsApp tiene acceso a la API de WhatsApp');
    console.error('   - La cuenta de Twilio está activa y tiene saldo');
  }

  process.exit(1);
});