const express    = require("express");
var bodyParser   = require('body-parser');
const fileSystem = require("fs");
const app        = express();

// Inizializzazione tramite express.
app.use(express.static('public'));
app.use(express.json());

// Setup per la visualizzazione grafica dei file html e 
// per configurare la cartella views come principale.
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

// Variabile che memorizza il file json contentente i dati.
let eventi = JSON.parse(fileSystem.readFileSync("./views/data.json"));

/* ENDPOINT GET */
// N°1 - Endpoint per utenti browser. 
// La richiesta get senza parametri porta alla pagina di index.
app.get('/', (req, res) => {
  res.render('./views/index.html');
});

// N°2 - Endpoint per tutti i dati.
// Fornisce tutti i dati json puri
app.get('/rawdata', (req, res) => {
  console.log("Richiesta dei dati json puri.");
  res.send(eventi);
});

// N°3 - Endpoint per fornire le varie pagine html di visualizzazione.
// In base al parametro fornisce la pagina richiesta.
app.get('/:page', (req, res) => {
  res.render('./views/'+ req.params.page + '.html');
})

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

