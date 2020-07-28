const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');

//inicialitations

const app = express();

//settings
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
  }))
  app.set('view engine', '.hbs');
  app.use(express.urlencoded({extended: false}));//recibir los datos de usuarios 
  app.use(express.json());
//Middlewares

app.use(morgan('dev'));

//Global variables

app.use((req, res, next) => {
 
    next();

  });

//Routes
app.use(require('./routes'));
app.use('/realizarEv',require('./routes/realizarEv'));

app.use('/compras',require('./routes/compras'));
//app.use('/pruebas',require('./routes/pruebas'));

//Report Routes

app.use('/reporteProveedor',require('./reports/proveedor'));

//Public

app.use(express.static(path.join(__dirname, 'public')));

//Starting the server

app.listen(app.get('port'), () =>{
    console.log('Server on port: ',app.get('port'));
    
    })


