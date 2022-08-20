const express = require("express");
var bodyParser = require("body-parser");
const fileSystem = require("fs");
const app = express();

// Inizializzazione tramite express.
app.use(express.static("public"));
app.use(express.json());

// Setup per la visualizzazione grafica dei file html e
// per configurare la cartella views come principale.
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", __dirname);

/* ---------------------- ENDPOINT GET ---------------------- */
// N° 1 - Endpoint per utenti browser.
// La richiesta get senza parametri porta alla pagina di index.
app.get("/", (req, res) => {
  res.render("./views/index.html");
});

// N° 2 - Endpoint per tutti i dati.
// Fornisce tutti i dati puri
app.get("/rawdata", (req, res) => {
  console.log("Richiesta dei dati puri.");
  res.type("text/csv").sendFile(__dirname + "/views/data.csv");
});

// N° 3 - Endpoint per fornire le varie pagine html di visualizzazione.
app.get("/mappa", (req, res) => {
  res.render("./views/mappa.html");
});

app.get("/inserisci", (req, res) => {
  res.render("./views/inserisci.html");
});

app.get("/rimuovi", (req, res) => {
  res.render("./views/rimuovi.html");
})

app.get("/cerca", (req, res) => {
  res.render("./views/cerca.html");
});

// N° 4 - Restituisce il dato alla posizione specificata (se si pass un numero) o
// i dati con un determinato comune.
app.get("/data/:par", (req, res) => {
  let eventi = CSVToArray(fileSystem.readFileSync("./views/data.csv"));
  console.log(req.params.par);
  // Controllo se han passato un parametro numerico o di tipo stringa.
  if (isNaN(req.params.par)) { 
    let data = [];
    eventi.forEach(elemento => { // Salvo ogni elemento in cui i comuni combaciano.
      let splitted = elemento.toString().split(";");
      if (splitted[3] === req.params.par.toUpperCase())
        data.push(elemento);
    });
    if (data.length === 0) { // Se l'array è vuoto non abbiamo trovato niente.
      res.status(404).send("Non esistono eventi nel comune richiesto.");
    } else {
      res.status(200).send(JSON.stringify(data));
    }
  } else {
      if (eventi.length > req.params.par && req.params.par > 0) {
        res.status(200).send(eventi[req.params.par]);
      } else {
        res.status(400).send('Elemento non presente in lista o parametro illegale');
      }
  }
});

// N° 5 - Endpoint aggiunta evento.
// La richiesta permette di aggiungere un nuovo punto di interesse tramite form html.
app.get("/inserimento", (req, res) => {
  let eventi = CSVToArray(fileSystem.readFileSync("./views/data.csv"));
  // Acquisisco i dati dalla query.
  let didascalia    = req.query.didascalia;
  let tipologia     = req.query.tipologia;
  let denominazione = req.query.denominazione
  let comune        = req.query.comune;
  let indirizzo     = req.query.indirizzo;
  console.log("indirizzo: " + indirizzo);
  let civico        = (indirizzo === "")? "" : req.query.civico ; //Se l'indirizzo è vuoto il civico è inutile metterlo
  let telefono      = req.query.telefono;
  let email         = req.query.mail;
  let sito          = req.query.sito;
  let latitudine    = req.query.latitudine;
  let longitudine   = req.query.longitudine;
  let orario        = req.query.orario;  
  // Creo il punto di interesse da memorizzare.
  let evento = [didascalia           + ";" + 
                tipologia            + ";" + 
                denominazione        + ";" +
                comune.toUpperCase() + ";" + 
                indirizzo            + ";" +
                civico               + ";" +
                telefono             + ";" + 
                email                + ";" +
                sito                 + ";" +
                latitudine           + ";" +
                longitudine          + ";" +
                orario];
  // Memorizzo il punto di interesse e riscrivo nel file i dati nuovi 
  eventi.push(evento);
  // L'input di orario lascia un '/n' e per risolverlo lo mettiamo per ultimo per non 
  // mettere una escape sequence in più
  let csv = "";
  for (let i = 0; i < eventi.length - 1; i++) {
    csv += String(eventi[i]) + "\n";
  }
  csv += String(eventi[eventi.length - 1]);
  
  // Scrivo il file e mostro la pagina di successo.
  fileSystem.writeFileSync(__dirname + "/views/data.csv", csv);
  res.render("./views/successo.html");
});

/* ---------------------- ENDPOINT DELETE ---------------------- */
// N° - 1 Endpoint rimozione punto di interesse.
// Rimuove il punto di interesse alla posizione specificata.
app.delete("/rimuovi/:position", (req, res) => {
  let eventi = CSVToArray(fileSystem.readFileSync("./views/data.csv"));
  console.log("Richiesta di rimozione dell'elemento n° " + req.params.position);
  if (eventi.length >= req.params.position && req.params.position > 0) {
    console.log(eventi[req.params.position]);
    eventi.splice(req.params.position, 1);
    let csv = "";
    for (let i = 0; i < eventi.length - 1; i++) {
      csv += String(eventi[i]) + "\n";
    }
    csv += String(eventi[eventi.length - 1]);
    fileSystem.writeFileSync(__dirname + "/views/data.csv", csv);
    res.status(200).send("Elemento eliminato correttamente.");
  } else {
    res.status(400).send('Elemento non presente in lista o parametro illegale');
  }
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

/* ---------------------- FUNZIONI (NO ENDPOINT) ---------------------- */
// N° 1 - Funzione per convertire da CSV ad array.
/* Preso da https://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm */
function CSVToArray(strData, strDelimiter) {
  // Check to see if the delimiter is defined. If not, then default to comma.
  strDelimiter = strDelimiter || ",";
  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    // Delimiters.
    "(\\" +
      strDelimiter +
      "|\\r?\\n|\\r|^)" +
      // Quoted fields.
      '(?:"([^"]*(?:""[^"]*)*)"|' +
      // Standard fields.
      '([^"\\' +
      strDelimiter +
      "\\r\\n]*))",
    "gi"
  );
  // Create an array to hold our data. Give the array a default empty first row.
  var arrData = [[]];
  // Create an array to hold our individual pattern matching groups.
  var arrMatches = null;
  // Keep looping over the regular expression matches until we can no longer find a match.
  while ((arrMatches = objPattern.exec(strData))) {
    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[1];
    // Check to see if the given delimiter has a length (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know that this delimiter is a row delimiter.
    if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push([]);
    }
    var strMatchedValue;
    // Now that we have our delimiter out of the way, let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[2]) {
      // We found a quoted value. When we capture this value, unescape any double quotes.
      strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
    } else {
      // We found a non-quoted value.
      strMatchedValue = arrMatches[3];
    }
    // Now that we have our value string, let's add it to the data array.
    arrData[arrData.length - 1].push(strMatchedValue);
  }
  // Return the parsed data.
  return arrData;
}
