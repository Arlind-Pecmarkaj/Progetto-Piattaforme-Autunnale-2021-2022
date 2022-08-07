const express  = require("express");
var bodyParser = require('body-parser')
const app      = express();



app.use(express.static('public'))
app.use(express.json());

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);


/* ENDPOINT GET */
// N°1 - Endpoint per utenti browser. 
// La richiesta get senza parametri porta alla pagina di index.
app.get('/', (req, res) => {
  res.render('./views/index.html');
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

