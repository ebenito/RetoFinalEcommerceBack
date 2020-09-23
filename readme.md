# beComm
<h3><font color='red'>B</font>ackend e-<font color='red'>C</font>ommerce</h3>
	
[beCom](https://becomm.herokuapp.com/) es una API rest full basada Node.js, Express y MongoDB. Es el proyecto final del bootcamp backend de GeeksHubs Academy.

El proyecto consta además de una implementación de frontend, a modo de demostración. Es accesible atraves de Heroku, en este link:

[https://becomm.herokuapp.com/](https://becomm.herokuapp.com/)

Puede descargar una copia del proyecto, e instalar todos los componentes necesario con el siguiente comando de node.js

```javascript
    npm i 
```
Se recomienda después hacer una actualización de los módulos con actualizaciones de seguridad; a fin de correguir posibles vuelnerabilidades descubiertas. Para ello escriba en la consola:

```javascript
    npm audit fix
```
Para el envío de los correos electronicos se ha optado por hacer uso de [SendGrid](https://sendgrid.com/), de Twilio. Con este fin necesitará abrir una cuenta gratuita en su web; y crearte un "sender" que corresponda con una cuenta real de email, y después obtener una API Key. Después deberás indicar tanto el email configurado como la API Key en el archivo .env

Aquí puedes ver los pasos con más detalle: https://sendgrid.com/docs/for-developers/sending-email/quickstart-nodejs/


Una vez instalado y configurado todo, arranca el proyecto con uno de los siguientes comandos de node:


```javascript
Para el modo desarrollo, que permite depuración:
    npm run dev

Para el modo producción:
    npm run start
```

A continuación puedes consultar las caracteristicas implementadas en <i>beComm</i>:

<ul>
    <li>Gestión de usuarios:</li>
    <ul>
        <li>Añadir usuario</li>
        <li>Modificar usuario</li>
        <li>Borrar usuario</li>
        <li>Consultar datos del usuario</li>   
        <li>Confirmar correo del usuario (mediante el email de confirmación que recibe</li>
        <li>Solo los usuarios con rol "Admin" pueden ver el listado de todos los usuarios, y de todos los vendedores</li>
        <li>Login de usuario con generación de token JWT, para su validación en zonas restringidas</li>
    </ul>
    <li>Gestión de productos:</li>
    <ul>
        <li>Añadir producto</li>
        <li>Modificar producto</li>
        <li>Borrar producto</li>
        <li>Consultar nombre de producto, por su ID</li>  
        <li>Consultar listado de productos</li>   
        <ul>
            <li>General</li>
            <li>De un solo vendedor</li>
            <li>De una sola categoría</li>
            <li>Ordenado por número de ventas</li>
            <li>Ordenado por precio de mayor a menor</li>
            <li>Ordenado por precio de menor a mayor</li>
            <li>Ordenado por nombre</li>
        </ul>
    </ul>
    <li>Gestión de categorías:</li>
    <ul>
        <li>Añadir categoría</li>
        <li>Modificar categoría</li>
        <li>Borrar categoría</li>
        <li>Consultar listado de categorias</li>   
        <ul>
            <li>General</li>
            <li>General, con datos de productos asociados</li>
            <li>Todas las categoria de un producto</li>            
        </ul>
    </ul>
    <li>Gestión de compras:</li>
    <ul>
        <li>Añadir pedido</li>
        <li>Obtener información de un pedido</li>
        <li>Listado de pedidos de un usuario</li>
        <li>Establecer el pedido como:</li>   
        <ul>
            <li>Pagado</li>
            <li>Envíado</li>            
        </ul>
    </ul>
    <li>Gestión de facturas:</li>
    <ul>
        <li>Crear factura de un pedido, y enviarla por email</li>
        <li>Modificar factura, y enviarla por email</li>
        <li>Mostrar información de la factura</li>   
    </ul>
</ul>
