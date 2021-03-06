require("dotenv").config({ path: "../.env" });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
var express = require("express");
var app = express();
console.log(accountSid + "" + authToken + " " + process.env.TWILIO_ACCOUNT_SID);
const client = require("twilio")(accountSid, authToken);
const catalogo = require("./envioDoCatalogo.js");
const enviarArquivo = require("./envioDeArquivo.js");
const enviarEmail = require("./envioDeEmail.js");
const { MessagingResponse } = require("twilio").twiml;
const fs = require("fs");
app.use(express.urlencoded({ extended: true }));
const axios = require("axios");
const path = require("path");
const { fstat } = require("fs");
var menu = false;
var voltar = false;
var enviodeemail = false;

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
app.get("/catalogo.pdf", function (req, res) {
  //res.header("Content-Type", "application/pdf").status(200);
  //res.header("Content-Type", "text/xml").status(200);
  console.log("fui chamado" + __dirname);
  res.sendFile(path.join(__dirname, "../", "catalogoabx.pdf"), (err) => {
    if (err) {
      console.log("erro" + err);
    } else {
      console.log("arquivo achado com sucesso");
    }
  });
});
app.get("/logo.jpg", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "abximagem.jpg"), (err) => {
    if (err) {
      console.log("erro" + err);
    } else {
      console.log("a imagem foi achada com sucesso");
    }
  });
});
app.post("/whatsapp", async (req, res) => {
  let answer;
  const incomingWhatsappMsg = req.body.Body.toLowerCase();
  const twiml = new MessagingResponse();
  const results = twiml.message();

  console.log(incomingWhatsappMsg);

  try {
    if (
      incomingWhatsappMsg == "oii" ||
      incomingWhatsappMsg == "oi" ||
      incomingWhatsappMsg == "ola" ||
      incomingWhatsappMsg == "quanto" ||
      (menu == false && voltar == false)
    ) {
      console.log("enviadecima", enviodeemail);
      console.log(
        "menu = " +
          menu +
          " voltar = " +
          voltar +
          " envio d email: " +
          enviodeemail
      );
      if (enviodeemail) {
        enviodeemail = false;
      }
      res.header("Content-Type", "text/xml").status(200);

      results.body(
        "Ol??, Seja bem vindo! eu sou o *Yuri* " +
          decodeURI("%F0%9F%A4%96") +
          "atendente virtual da *Abx Imports* deseja iniciar o atendimento? Digite *Sim* ou *N??o* "
      );

      menu = true;
      voltar = false;
      res.send(results.toString());
    } else if (
      (incomingWhatsappMsg == "sim" && menu && !enviodeemail) ||
      (incomingWhatsappMsg == "voltar" ? (voltar = true) : "")
    ) {
      if (incomingWhatsappMsg == "voltar") {
        console.log("enviei voltar confirmado");
        menu = false;
        enviodeemail = false;
      }

      console.log(
        "menu = " +
          menu +
          " voltar = " +
          voltar +
          " envio d email: " +
          enviodeemail
      );

      res.header("Content-Type", "text/xml").status(200);
      results.body(
        `Para agilizar o atendimento Por favor escolha \n uma op????o abaixo ${decodeURI(
          "%F0%9F%91%87"
        )} 
 digite ${decodeURI("%31%E2%83%A3")} *Lista de produtos*  \n digite ${decodeURI(
          "%32%E2%83%A3"
        )} para saber a *localiza????o da loja* \n digite ${decodeURI(
          "%33%E2%83%A3"
        )} para falar com um *atendente*`
      );

      res.end(results.toString());
    } else if (
      (incomingWhatsappMsg == "1" && menu) ||
      (incomingWhatsappMsg == "1" && voltar)
    ) {
      const numero = req.body.From;
      // res.header("Content-Type", "application/pdf").status(200);

      //  results.body("estamos enviando um arquivo");

      if (await catalogo.envioDeProdutos(numero)) {
        setTimeout(() => {
          console.log("sera qur foi");
          res.header("Content-Type", "text/xml").status(200);
          results.body(
            "deseja que enviamos o cat??logo em uma planilha para o seu email ? digite *sim* ou *n??o*"
          );

          res.end(results.toString());
          enviodeemail = true;
        }, 2000);
      }
    } else if (
      (incomingWhatsappMsg == "nao" || incomingWhatsappMsg == "n??o") &&
      enviodeemail
    ) {
      console.log(
        "menu " + menu + " voltar " + voltar + " envio de email " + enviodeemail
      );
      res.header("Content-Type", "text/xml").status(200);

      results.body(
        "atendimento encerrado !\n para voltar ao menu envie *voltar* !"
      );
      enviodeemail = undefined;
      menu = undefined;
      voltar = undefined;
      res.end(results.toString());
    } else if (incomingWhatsappMsg == "sim" && enviodeemail) {
      console.log(incomingWhatsappMsg == "sim");
      console.log("envio", enviodeemail);

      res.header("Content-Type", "text/xml").status(200);

      results.body(
        "Digite seu email para o envio \n exemplo: *teste123@gmail.com*"
      );
      res.end(results.toString());
    } else if (incomingWhatsappMsg == "encerrar") {
      console.log(
        "menu = " +
          menu +
          " voltar = " +
          voltar +
          " envio d email: " +
          enviodeemail
      );
      res.writeHead(200, { "Content-Type": "text/xml" });
      results.body(
        "atendimento encerado, para voltar ao atendimento envie qualquer coisa"
      );
      menu = false;
      voltar = false;
      enviodeemail = false;

      res.end(results.toString());
    } else if (
      (incomingWhatsappMsg.search(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      ) == 0 &&
        enviodeemail) ||
      (incomingWhatsappMsg.search(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      ) == -1 &&
        enviodeemail)
    ) {
      if (
        incomingWhatsappMsg.search(
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        ) == -1 &&
        enviodeemail
      ) {
        console.log("email", enviodeemail);
        console.log(
          incomingWhatsappMsg.search(
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
          ) == -1
        );

        res.header("Content-Type", "text/xml").status(200);
        results.body("email *inv??lido* , verifique seu email e envie de novo");

        res.send(results.toString());
      } else {
        console.log("existe1", await fs.existsSync("planilhacatalogo.xlsx"));
        if (await !fs.existsSync("planilhacatalogo.xlsx")) {
          enviarEmail.envioDeDados();
        }
        const resp = await enviarEmail.enviarEmail(incomingWhatsappMsg);
        if (resp) {
          res.header("Content-Type", "text/xml").status(200);
          results.body(
            "email enviado com sucesso para este email: " +
              incomingWhatsappMsg +
              "\n" +
              "aguarde estamos enviando um cat??logo em pdf" +
              "\n" +
              "para encerrar o atendimento envie *encerrar*"
          );
          enviarArquivo.envioDeArquivo(req.body.From);
          console.log(
            "menu = " +
              menu +
              " voltar = " +
              voltar +
              " envio d email: " +
              enviodeemail
          );

          res.send(results.toString());
        } else {
          res.header("Content-Type", "text/xml").status(200);
          results.body("erro ao enviar o email");
          res.send(results.toString());
        }
      }
    } else if (
      (incomingWhatsappMsg == "2" && menu) ||
      (incomingWhatsappMsg == "2" && voltar)
    ) {
      console.log(
        "menu = " +
          menu +
          " voltar = " +
          voltar +
          " envio d email: " +
          enviodeemail
      );
      console.log(incomingWhatsappMsg !== isNaN && incomingWhatsappMsg > 3);
      res.writeHead(200, { "Content-Type": "text/xml" });
      results.body(
        "nossa loja fica pr??ximo ao  ...  \n https://www.google.com.br/maps/place/Supermercados+Nagumo+-+Taubat%C3%A9+Arei%C3%A3o/@-23.0213925,-45.5871627,12z/data=!4m9!1m2!2m1!1snagumo!3m5!1s0x94ccf9a58ff61643:0xcc834660c6010c71!8m2!3d-23.0122686!4d-45.5526126!15sCgZuYWd1bW8iA4gBAVoIIgZuYWd1bW-SAQtzdXBlcm1hcmtldA"
      );
      res.end(results.toString());
      // res.end();
    } else if (
      (incomingWhatsappMsg == "3" && menu) ||
      (incomingWhatsappMsg == "3" && voltar)
    ) {
      results.body(
        "entre no link para falar com um atendente em um chat vivo \n https://chat-ao-vivo-front-end.herokuapp.com/"
      );
      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(results.toString());
    } else if (
      incomingWhatsappMsg == "nao" ||
      (incomingWhatsappMsg == "n??o" && menu)
    ) {
      results.body(
        "atendimento encerado, para voltar ao atendimento envie voltar"
      );
      menu = false;
      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(results.toString());
    } else {
      results.body(
        "N??o consegui compreender, desculpe.  digite *Voltar* para ir at?? o menu"
      );
      // menu = false;

      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(results.toString());
    }
  } catch (error) {
    console.log(error);
  }
});
app.listen(process.env.PORT || 8080, function () {
  console.log("Example app listening on port 8080!");
});
