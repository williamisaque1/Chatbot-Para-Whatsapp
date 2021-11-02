const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const envioDeArquivo = (numero) => {
  console.log("chegou o numero aqui " + numero);
  client.messages
    .create({
      body: `catálogo de produtos `,
      mediaUrl: `https://chat-bot-whats-app.herokuapp.com/catalogo.pdf`,
      from: "whatsapp:+14155238886",
      to: `${numero}`,
    })
    .then((message) => {
      console.log(`${message.sid}`);
    });
};

module.exports = { envioDeArquivo };
