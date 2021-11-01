const nodeMailer = require("nodemailer");
const xl = require("excel4node");
const wb = new xl.Workbook();
const produtos = require("./produtos");
function envioDeDados() {
  const ws = wb.addWorksheet("catálogo do mês de outubro");
  const nomecolunas = ["produto", "descricao", "preço"];
  let nColuna = 1;
  let nLinha1 = 2;
  let nLinha2 = 2;
  let nLinha3 = 2;
  nomecolunas.forEach((nome) => {
    ws.cell(1, nColuna++).string(nome);
  });
  //console.log(produtos.d20);
  for (const i in produtos) {
    //console.log(produtos[i].titulo);
    ws.cell(nLinha1++, 1).string(produtos[i].titulo);
  }
  for (const i in produtos) {
    console.log(produtos[i].descri.split("*")[0]);
    ws.cell(nLinha2++, 2).string(produtos[i].descri.split("*")[0]);
  }
  for (const i in produtos) {
    console.log(produtos[i].descri.split("*")[1]);
    ws.cell(nLinha3++, 3).string(produtos[i].descri.split("*")[1]);
  }

  // ws.cell(nLinha1++, 1).string(inf.titulo);

  /* i.forEach((inf2) => {
      ws.cell(nLinha2++, 2).string(inf2.descri);
    });*/
  /*i.forEach((inf3) => {
      ws.cell(nLinha3++, 3).string(inf3.);
    });
  }
  */

  wb.write("planilhacatalogo.xlsx");
}
//envioDeDados();
const remetente = nodeMailer.createTransport({
  service: "hotmail",
  auth: {
    user: "abximports@outlook.com",
    pass: process.env.SENHA,
  },
});

function enviarEmail(dados) {
  if (dados != undefined) {
    console.log("email do usuario" + dados);

    remetente.sendMail(
      (destinatario = {
        from: "abximports@outlook.com",
        to: dados,
        subject: "catálogo",
        text: "envio do catálogo da abx imports ",
        html: "<h1>bem vindo a abx imports</h1><h2>olá, \n sua planilha com os produtos chegou !!!  </h2><img  width='350' height='350' src='https://chat-bot-whats-app.herokuapp.com/logo.jpg'/>",
        attachments: [
          {
            filename: "planilhacatalogo.xlsx",
            path: `planilhacatalogo.xlsx`,
            cid: "nyan@example.com",
          },
        ],
      }),
      function (err) {
        if (err) {
          console.log("erro ao enviar email", err);
        } else {
          console.log("email enviado com sucesso");
        }
      }
    );
  }
}

module.exports = { enviarEmail, envioDeDados };
