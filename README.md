### Studente : Pecmarkaj Arlind
### Matricola:           305991

---

# Punti di interesse storico nelle Marche

---

## Descrizione e obbiettivi del progeto

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

### Documentazione API

Sezione da terminare.

---

### Messa online del servizio.

Il servizio è disponibile su: https://pdgt-punti-interesse-marche.glitch.me

---

## TODO

Alla data di questa commit (26/08/2022) il progetto è ancora in fase di lavoro e il seguente file
readme non è aggiornato.
