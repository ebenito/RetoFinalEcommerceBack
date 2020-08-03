const sendgrid = require("./helpers/sendgrid");
const mail = `
<html>
<body>
    <h3>Bienvenido a nuestro sitio web de pruebas en Heroku</h3>
    <img src="https://rciproducciones.files.wordpress.com/2017/01/a540b0498bad80c0269f21900050c899.png"
        alt="Bienvenido" />
    <hr />
    <div>
        Gracias JUAN por registrarte en nuestro sitio web.
        <br />
        Haz click
        <a href="https://mispruebas-api.herokuapp.com/users/confirm/5f2123a6754f18447c81f5ea">aquí</a>
        para confirmar tu registro.
    </div>
</body>
</html>
`
sendgrid.enviarCorreo("esteban.benito@gmail.com","Prueba","Texto de prueba", mail);
if (sendgrid.resultado == "OK")
{
    console.log("correo enviado");
}

sendgrid.EnviarMailBienvenida("esteban.benito@gmail.com");

sendgrid.EnviarOtroCorreo("esteban.benito@gmail.com");
