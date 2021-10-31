const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const produtos = require("./produtos");
const envioDeProdutos = (numero) => {
  for (const i in produtos) {
    console.log(`${i} ${produtos[i].titulo} ${produtos[i].descri}`);

    client.messages
      .create({
        body: `*${produtos[i].titulo}* \n${produtos[i].descri} `,
        mediaUrl: `${produtos[i].img}`,
        from: "whatsapp:+14155238886",
        to: `${numero}`,
      })
      .then((message) => console.log(`${message.sid}`));
  }
  return true;
};

module.exports = { envioDeProdutos };
