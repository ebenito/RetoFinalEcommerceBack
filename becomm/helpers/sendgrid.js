require('dotenv').config();

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function EnviarCorreo(emailPara, Asunto, CuerpoPlano, CuerpoHTML)
{  
    const msg = {
        from: process.env.email,
        to: emailPara,
        subject: Asunto,
        text: CuerpoPlano,
        html: CuerpoHTML,
    };

    sgMail.send(msg)
        .then(this.resultado= "OK")
        .catch(error => {
            this.resultado= "KO";
            console.error(error);
            res.status(500).send(error);
        });

}


function EnviarMailBienvenida(email)
{
    sgMail.send({
        to: email,
        from: process.env.email,
        subject: 'Bienvenido!',
        html: '<h3>Bienvenido a mi web f</h3>',
        //}, {
            "filters" : {
              "footer" : {
                "settings" : {
                  "enable" : 1,
                  "text/html" : "<p>Gracias,<br />The SendGrid Team<p>",
                  "text/plain" : "Thanks,\n The SendGrid Team"
                }
              }
            },
        files: [
            {
                filename:     '',           // required only if file.content is used.
                contentType:  '',           // optional
                cid:          '',           // optional, used to specify cid for inline content
                path:         '',           //
                url:          '',           // == One of these three options is required
                content:      ('' | Buffer) //
            }
        ]
          })
        .then(this.resultado= "OK")
        .catch(error => {
            this.resultado= "KO";
            console.error(error);
            res.status(500).send(error);
    });

};

var fs = require("fs");
function base64_encode(file){
    let bitmap = fs.readFileSync(file);
    return new Buffer.from(bitmap).toString('base64');
  }


function EnviarFactura(email, res)
{
    let data_base64 = base64_encode('./Facturas/prueba.pdf');

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
        type: 'application/pdf',
        disposition: 'attachment'
      }
     ]
    };
    
    sgMail.send(msg)
    .then((response) => {
        this.resultado= "OK"
    })
    .catch((error) => {
        this.resultado= 'KO'
    });
}

module.exports.enviarCorreo = EnviarCorreo;
module.exports.EnviarMailBienvenida = EnviarMailBienvenida;
module.exports.EnviarFactura = EnviarFactura;