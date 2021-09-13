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
  console.log(req.body);

  try {
    if (
      incomingWhatsappMsg == "oii" ||
      incomingWhatsappMsg == "oi" ||
      incomingWhatsappMsg == "ola" ||
      incomingWhatsappMsg == "quanto"
    ) {
      res.header("Content-Type", "text/xml").status(200);
      results.body(
        "bem vindo a *abx imports*\nconhecer a *Lista de produtos* envie 1\nsaber a *localização da loja* envie 2\nfalar com um *atendente* envie 3"
      );
      res.end(results.toString());
    } else if (incomingWhatsappMsg == "1") {
      const numero = req.body.From;
      catalogo.envioDeProdutos(numero);
    } else if (incomingWhatsappMsg == "2") {
      // header("Content-Type", "text/xml").status(200);
      res.writeHead(200, { "Content-Type": "text/xml" });
      results.body(
        "nossa loja fica próximo ao  ...  \n https://www.google.com.br/maps/place/Supermercados+Nagumo+-+Taubat%C3%A9+Arei%C3%A3o/@-23.0213925,-45.5871627,12z/data=!4m9!1m2!2m1!1snagumo!3m5!1s0x94ccf9a58ff61643:0xcc834660c6010c71!8m2!3d-23.0122686!4d-45.5526126!15sCgZuYWd1bW8iA4gBAVoIIgZuYWd1bW-SAQtzdXBlcm1hcmtldA"
      );

      res.end(results.toString());
    } else if (incomingWhatsappMsg == "3") {
      results.body("atendente falando");
      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(results.toString());
    } else {
      results.body("não consegui achar uma resposta valida");
      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(results.toString());
    }
  } catch (error) {
    console.log(error);
  }
});
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

//.header("Content-Type", "text/xml").status(200);
//res.writeHead(200, { "Content-Type": "text/xml" });
/*results.media(
    "https://cataas.com/cat"
    //"https://static.netshoes.com.br/produtos/smartwatch-d15/06/NTZ-0047-006/NTZ-0047-006_zoom1.jpg?ts=1618244157&ims=544x",
  );
 */
