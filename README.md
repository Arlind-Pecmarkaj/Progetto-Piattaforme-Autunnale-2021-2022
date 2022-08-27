### Studente : Pecmarkaj Arlind
### Matricola:           305991

---

# Punti di interesse storico nelle Marche

---

## Descrizione e obbiettivi del progetto

Le Marche sono una regione poco conosciuta per il loro lato turistico nascosto.   
La piattaforma si configura in modo tale da far scoprire i principali punti di interesse storico, 
quali per esempio paesaggi, eventi tradizionali o archeologici, musei, ecc presenti in regione.   
Per far ciò usiamo i dati forniti dalla regione (vedi Dati e servizi esterni sfruttati) costruendo
delle API e un sito web che le sfrutta in modo tale da:
- avere la lista dei punti di interesse presenti.
- ricercare un punto per indice nella lista o per comune
- rimuovere un punto di interesse nel caso non fosse più accessibile.  

Il sito web inoltre permetterà di visualizzare i punti di interesse tramite una mappa dotata di markdown.

---

## Descrizione dell'architettura e delle scelte implementative.
L'architettura back-end si basa interamente su NodeJS e i dati verranno memorizzati tramite un  
file CSV.  
La scelta del CSV è dovuta alla composizione del dato che rappresenta un punto di interesse:
in questo modo la manipolazione dei dati è più semplice da gestire.  
Un punto di interesse sarà composto dai seguenti attributi:
- Didascalia*: semplice didascalia per riconoscere il punto;
- Tipologia*: macrocategoria di un punto. Può essere solo uno di questi tipo
  - Architettura e paesaggio;
  - Archeologia;
  - Storie e leggende;
  - Tradizioni;
- Denominazione*: denominazione ufficiale del punto;
- Comune*;
- Indirizzo;
- Civico;
- Telefono;
- Email;
- Sito Web;
- Latitudine*;
- Longitudine*;
- Orario di apertura;

In * sono segnati gli attributi obbligatori per ogni punto.
I dati originali prevedevano anche un attributo 'Immagine' che però è stato eliminato in quanto il server
che faceva da host per esse restituiva errori HTTP 503 rendendo non fruibili le immagini.  
Alcuni dei dati presenti sono stati leggermente modificati in quanto formattati male (si presume un inserimento manuale dei dati)
o senza senso.

Gli endpoint forniranno *esclusivamente* dati e niente altro. Questa scelta è stata pensata per 
rendere gli endpoint (a eccezione di uno) quanto più indipendenti dal client.  
L'architettura front-end si basa su HTML e JS per la richiesta dei dati compresa di validazione dei dati
nell'inserimento.
Gli endpoint funzionano comunque anche tramite richieste pervenute da client esterni.  

Per il back-end son state utilizzate i seguenti moduli e librerie;
 - express: framework che permette di usare NodeJS (https://expressjs.com).
 - fs: modulo per accedere e modificare i file presenti nel file system e permettere l'uso del file csv
 - ejs: modulo che permette di creare e renderizzare file html tramite js (https://ejs.co/).

Per il front-end son stati utilizzati invece:
 - Bootstrap 5: per avere un sito reattivo e graficamente gradevole (https://getbootstrap.com/).
 - OpenStreetMap: permette di avere una mappa dei punti di interesse (https://www.openstreetmap.org/)

---

## Dati e servizi esterni sfruttati.

Gli dati sono di tipo open e  provengono da:
http://www.datiopen.it/it/opendata/Archeologia_Storia_e_Tradizioni_Regione_Marche

Viene sfruttato come servizio esterno (come specificato nella sezione prcedente) OpenStreetMap.

---

## Documentazione API  
### Endpoint GET
- *pdgt-punti-interesse-marche.glitch.me/*

Endpoint che fornisce la pagina index.html        
**INPUT**: nessuno.    
**OUTPUT**: la pagina index.html contenuta nella cartella views.     

- *pdgt-punti-interesse-marche.glitch.me/rawdata*

Endpoint che fornisce tutti i dati contenuti nel file data.csv     
**INPUT**: nessuno.        
**OUTPUT**: il file data.csv contenuta nella cartella views.  

- *pdgt-punti-interesse-marche.glitch.me/mappa*

Endpoint che fornisce la pagina mappa.html dove sono contenute la mappa dei punti storici  
e la lista di essi        
**INPUT**: nessuno.   
**OUTPUT**: la pagina mappa.html contenuta nella cartella views.  

- *pdgt-punti-interesse-marche.glitch.me/inserisci*

Endpoint che fornisce la pagina inserisci.html che contiente il form web per inserire un  
nuovo punto storico.        
**INPUT**: nessuno.     
**OUTPUT**: la pagina inserisci.html contenuta nella cartella views.  

- *pdgt-punti-interesse-marche.glitch.me/rimuovi*

Endpoint che fornisce la pagina rimuovi.html per la rimozione di un punto di interesse storico.     
**INPUT**: nessuno.     
**OUTPUT**: la pagina rimuovi.html contenuta nella cartella views.       

- *pdgt-punti-interesse-marche.glitch.me/cerca*

Endpoint che fornisce la pagina cerca.html per la ricerca di un punto storico.          
**INPUT**: nessuno.   
**OUTPUT**: la pagina carca.html contenuta nella cartella views. 

- *pdgt-punti-interesse-marche.glitch.me/data/:par*

Endpoint che fornisce un subset dei punti di interesse.   
**INPUT**: 'par' che può essere un numero maggiore di 0 (in questo caso indica un indice) o una stringa
che rappresenta il comune.  
**OUTPUT**: Se 'par' è un valore numerico, viene fornito l'elemento all'indice specificato.   
Se 'par' è una stringa vengono forniti gli elementi che hanno attributo 'comune' uguale a 'par'.
Il dato viene fornito come oggetto JSON.  
Nel caso non esistesse l'elemento o il parametro fosse scritto male viene restituito l'HTTP response 
code 400.

- *pdgt-punti-interesse-marche.glitch.me/inserimento*

Endpoint dedicato all'inserimento di un punto di interesse tramite il form presente nella pagina 
inserisci.html;   
Per client esterni si rimanda all'enpoint POST ononimo.  
**INPUT**: La query string degli attributi del punto da inserire con i seguenti parametri 
  - didascalia;
  - tipologia;
  - denominazione;
  - comune;
  - indirizzo;
  - civico;
  - telefono;
  - mail;
  - sito;
  - latitudine;
  - longitudine;
  - orario;

**OUTPUT**: L'endpoint rimanda alla pagina 'successo.html'. La validazione viene fatta client-side. 

### Endpoint POST

- *pdgt-punti-interesse-marche.glitch.me/inserimento*

Endpoint per l'inserimento di un punto di interesse per client esterni.   
**INPUT**: L'endpoint richiede un JSON con nome degli attributi uguali all'endpoint GET ononimo.   
**OUTPUT**: L'endpoint fornisce un codice 200 se l'elemento è stato inserito correttamente, codice 400 altrimenti.  

### Endpoint DELETE

- *pdgt-punti-interesse-marche.glitch.me/rimuovi/:position*

Endpoint per la rimozione di un punto di interesse.
**INPUT**: L'endpoint richiede l'indice dell'elemento da eliminare (>0)
**OUTPUT**: Il server restituisce codice 200 se l'elemento è stato eliminato correttamente, codice 400 altrimenti.

---

## Messa online del servizio.

Il servizio è disponibile su: https://pdgt-punti-interesse-marche.glitch.me

---

## Utilizzo del servizio Web

---

## TODO

Alla data di questa commit (27/08/2022) il progetto è ancora in fase di lavoro e il seguente file
readme non è aggiornato.
