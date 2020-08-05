require("dotenv").config();

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function EnviarMailBienvenida(user) {
  const htmlmail = `
  <html>
  <body>
  <h3>Bienvenido <font color='blue'>${user.name}</font> a mi Comercio Electronico <font color='red'>b</font>e<font color='red'>C</font>omm</h3>
      <img src="https://rciproducciones.files.wordpress.com/2017/01/a540b0498bad80c0269f21900050c899.png"
          alt="Bienvenido" />
      <hr />
      <div>
          Gracias ${user.name} por registrarte en nuestro sitio web.
          <br />
          Haz click
          <a href="https://becomm-api.herokuapp.com/users/confirm/${user.id}">aqu&iacute;</a>
          para confirmar tu registro.
      </div>
  </body>
  </html>
  `;
  sgMail.send({
      to: user.email,
      from: process.env.email,
      subject: `¡Bienvenido ${user.name}!`,
      html: htmlmail,
    })
      .then((this.resultado = "OK"))
      .catch((error) => {
        this.resultado = "KO";
        console.error(error);
        res.status(500).send(error);
      });
}


function EnviarCorreo(emailPara, Asunto, CuerpoPlano, CuerpoHTML) {
  const msg = {
    from: process.env.email,
    to: emailPara,
    subject: Asunto,
    text: CuerpoPlano,
    html: CuerpoHTML,
  };

  sgMail
    .send(msg)
    .then((this.resultado = "OK"))
    .catch((error) => {
      this.resultado = "KO";
      console.error(error);
      res.status(500).send(error);
    });
}


var fs = require("fs");
function base64_encode(file) {
  let bitmap = fs.readFileSync(file);
  return new Buffer.from(bitmap).toString("base64");
}

function EnviarFactura(email, res) {
  let data_base64 = base64_encode("./Facturas/prueba.pdf");

  const msg = {
    to: email,
    from: process.env.email,
    subject: `Factura`,
    text: `factura de prueba`,
    html: "<pre>factura</pre>",
    attachments: [
      {
        filename: `invoice.pdf`,
        content: data_base64,
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  sgMail
    .send(msg)
    .then((response) => {
      this.resultado = "OK";
    })
    .catch((error) => {
      this.resultado = "KO";
    });
}

module.exports.EnviarMailBienvenida = EnviarMailBienvenida;
module.exports.enviarCorreo = EnviarCorreo;
module.exports.EnviarFactura = EnviarFactura;
