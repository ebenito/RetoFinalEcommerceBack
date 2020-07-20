Para instalar Express-Generator:
    npm i -g express-generator

Crear el proyecto, con vistas Handlebars:
    express --hbs becomm  

Seguir las intrucciones para descargar todos los módulos, y después tratar de correguir vuelnerabilidades con:
    npm audit fix

Para los envíos de email usaremos SendGrid, que otorga mucha más autoridad a los emails y mejora la entrega de los mismos.
    npm install --save @sendgrid/mail

    