const mongoose = require('mongoose');
require('dotenv').config();

let MONGO_URI;

  //Conectamos a MongoDB; en producción creamos la variable de entorno con la cadena de conexión en producción, que incluye la password (asi no se verá publicamente al estar publicado en GIT) y en desarrollo usará la BD local.
   switch (process.env.Entorno) {
    case 'local':
      MONGO_URI = process.env.MongoDBLocal;
      break;
  
    default:
      MONGO_URI = process.env.MongoDBCloud;
      break;
  } 
 
  //console.log('Intentado conectar a MongoBD: ' + MONGO_URI);

  require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('Desde el servidor MongoBD con IP: '+ add);
  })

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() =>
    console.log("Conectado con éxito a MongoDB, en " + process.env.Entorno))
  .catch((error) => 
    console.error(error));
  
