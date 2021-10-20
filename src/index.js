require("dotenv").config({ path: "../.env" });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
var express = require("express");
var app = express();
console.log(accountSid + "" + authToken + "" + process.env.TWILIO_ACCOUNT_SID);
const client = require("twilio")(accountSid, authToken);
const catalogo = require("./envioDoCatalogo.js");
const { MessagingResponse } = require("twilio").twiml;
app.use(express.urlencoded({ extended: true }));
const axios = require("axios");
var menu = false;
var voltar = false;
/*
app.get("/api", async function (req, res) {
  let a = await axios.get(
    "http://mobile-aceite.tcu.gov.br/mapa-da-saude/rest/estabelecimentos/latitude/-23.0309/longitude/-45.5483/raio/10/?categoria=CL%C3%8DNICA"
  );
  res.send("Hello World!" + JSON.stringify(a.data))
})
*/
app.get("/", function (req, res) {
  res.send("Hello World!");

  client.messages
    .create({
      body: `iniciado 2 `,
      mediaUrl: ["https://cataas.com/cat"],

      from: "whatsapp:+14155238886",
      to: "whatsapp:+5512981176803",
    })
    .then((message) => console.log(JSON.stringify(message)));
});

app.post("/whatsapp", async (req, res) => {
  let answer;
  const incomingWhatsappMsg = req.body.Body.toLowerCase();
  const twiml = new MessagingResponse();
  const results = twiml.message();

  console.log(incomingWhatsappMsg);
  //console.log(req.body);
  console.log(encodeURI(req.body.Body));
  try {
    if (
      incomingWhatsappMsg == "oii" ||
      incomingWhatsappMsg == "oi" ||
      incomingWhatsappMsg == "ola" ||
      incomingWhatsappMsg == "quanto" /* &&
      (incomingWhatsappMsg == "sim" ||
        incomingWhatsappMsg == "nao" ||
        incomingWhatsappMsg == "1" ||
        incomingWhatsappMsg == "2" ||
        incomingWhatsappMsg == "3")*/
    ) {
      res.header("Content-Type", "text/xml").status(200);
      results.body(
        "Olá, Seja bem vindo! eu sou o *Yuri* " +
          decodeURI("%F0%9F%A4%96") +
          "atendente virtual da *Abx Imports* deseja iniciar o atendimento? Digite *Sim* ou *Não* "
      );
      menu = true;
      voltar = false;
      res.send(results.toString());
    } else if (
      (incomingWhatsappMsg == "sim" && menu) ||
      (incomingWhatsappMsg == "voltar" ? (voltar = true) : "")
    ) {
      if (incomingWhatsappMsg == "voltar") {
        menu = false;
      }
      console.log("menu = " + menu + "\nvoltar = " + voltar);
      console.log(incomingWhatsappMsg == "voltar" ? (voltar = true) : "");
      res.header("Content-Type", "text/xml").status(200);
      results.body(
        `Para agilizar o atendimento Por favor escolha uma opção abaixo ${decodeURI(
          "%F0%9F%91%87"
        )} 
        digite ${decodeURI(
          "%31%E2%83%A3"
        )} *Lista de produtos*  \n digite ${decodeURI(
          "%32%E2%83%A3"
        )} para saber a *localização da loja* \n digite ${decodeURI(
          "%33%E2%83%A3"
        )} para falar com um *atendente*`
      );

      res.end(results.toString());
    } else if (
      (incomingWhatsappMsg == "1" && menu) ||
      (incomingWhatsappMsg == "1" && voltar)
    ) {
      const numero = req.body.From;

      res.end(catalogo.envioDeProdutos(numero));
    } else if (
      (incomingWhatsappMsg == "2" && menu) ||
      (incomingWhatsappMsg == "2" && voltar)
    ) {
      // header("Content-Type", "text/xml").status(200);
      res.writeHead(200, { "Content-Type": "text/xml" });
      results.body(
        "nossa loja fica próximo ao  ...  \n https://www.google.com.br/maps/place/Supermercados+Nagumo+-+Taubat%C3%A9+Arei%C3%A3o/@-23.0213925,-45.5871627,12z/data=!4m9!1m2!2m1!1snagumo!3m5!1s0x94ccf9a58ff61643:0xcc834660c6010c71!8m2!3d-23.0122686!4d-45.5526126!15sCgZuYWd1bW8iA4gBAVoIIgZuYWd1bW-SAQtzdXBlcm1hcmtldA"
      );

      res.end(results.toString());
    } else if (
      (incomingWhatsappMsg == "3" && menu) ||
      (incomingWhatsappMsg == "3" && voltar)
    ) {
      results.body("atendente falando");
      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(results.toString());
    } else if (
      incomingWhatsappMsg == "nao" ||
      (incomingWhatsappMsg == "não" && menu)
    ) {
      results.body("atendimento encerado");
      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(results.toString());
    } else {
      results.body(
        "Não consegui compreender, desculpe.  digite *Voltar* para ir até o menu"
      );
      menu = false;

      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(results.toString());
    }
  } catch (error) {
    console.log(error);
  }
});
app.listen(process.env.PORT || 8080, function () {
  console.log("Example app listening on port 3000!");
});

//.header("Content-Type", "text/xml").status(200);
//res.writeHead(200, { "Content-Type": "text/xml" });
/*results.media(
    "https://cataas.com/cat"
    //"https://static.netshoes.com.br/produtos/smartwatch-d15/06/NTZ-0047-006/NTZ-0047-006_zoom1.jpg?ts=1618244157&ims=544x",
  );
 */
