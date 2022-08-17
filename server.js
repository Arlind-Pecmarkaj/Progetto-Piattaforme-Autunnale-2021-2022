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

// Variabile che memorizza il file json contentente i dati.
let eventi = CSVToArray(fileSystem.readFileSync("./views/data.csv"));

/* ---------------------- ENDPOINT GET ---------------------- */
// N°1 - Endpoint per utenti browser.
// La richiesta get senza parametri porta alla pagina di index.
app.get("/", (req, res) => {
  res.render("./views/index.html");
});

// N°2 - Endpoint per tutti i dati.
// Fornisce tutti i dati puri
app.get("/rawdata", (req, res) => {
  console.log("Richiesta dei dati puri.");
  console.log(eventi);
  res.type("text/csv").sendFile(__dirname + "/views/data.csv");
});

app.get("/prova", (req, res) => {
  res.send(eventi);
});

// N°3 - Endpoint per fornire le varie pagine html di visualizzazione.
app.get("/mappa", (req, res) => {
  res.render("./views/mappa.html");
});

app.get("/inserisci", (req, res) => {
  res.render("./views/inserisci.html");
});

app.get("/modifica", (req, res) => {
  res.render("./views/modifica.html");
});

app.get("/rimuovi", (req, res) => {
  res.render("./views/rimuovi.html");
})

app.get("/cerca", (req, res) => {
  res.render("./views/cerca.html");
})

/* ---------------------- ENDPOINT POST ---------------------- */
// N°1 - Endpoint aggiunta evento.
// La richiesta post permette di aggiungere un nuovo punto di interesse.
app.post("/inserisci", (req, res) => {
  const evento = req.body;
  eventi.push(evento);
  fileSystem.writeFileSync("./views/data.csv", JSON.stringify(eventi));
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

/* FUNZIONE PER CONVERTIRE DA CSV AD ARRAY */
/* Preso da https://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm */
function CSVToArray(strData, strDelimiter) {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
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

  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;

  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while ((arrMatches = objPattern.exec(strData))) {
    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[1];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push([]);
    }

    var strMatchedValue;

    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[2]) {
      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
    } else {
      // We found a non-quoted value.
      strMatchedValue = arrMatches[3];
    }

    // Now that we have our value string, let's add
    // it to the data array.
    arrData[arrData.length - 1].push(strMatchedValue);
  }

  // Return the parsed data.
  return arrData;
}
