# Analisi Chat WhatsApp

Applicazione web per analizzare le chat di gruppo esportate da WhatsApp.
Si carica il file `.txt` esportato e l'app genera statistiche e grafici sui
messaggi del gruppo: messaggi per partecipante, attività per giorno e per ora,
tipologie di messaggi, chi inizia le conversazioni e altro ancora.

## Privacy e trattamento dei dati

L'intero processo, **lettura del file, analisi dei messaggi e generazione delle statistiche**, avviene **esclusivamente in locale**, all'interno del browser
dell'utente. 
In particolare:

- il file `.txt` **non viene mai caricato o inviato a un server**;
- i messaggi e i risultati delle analisi restano **soltanto nella memoria del dispositivo** durante l'utilizzo;
- chiudendo o ricaricando la pagina, tutti i dati elaborati vengono eliminati.

Questa scelta garantisce la massima riservatezza delle conversazioni analizzate.

> **Importante:** il progetto funziona solo con le esportazioni effettuate da
> **iPhone** e con il telefono impostato in **lingua italiana**. Il formato di
> data, ora e le diciture dei messaggi (foto, audio, chiamate, ecc.) dipendono
> da queste due condizioni: esportazioni da Android o in altre lingue non
> vengono interpretate correttamente.

## Anteprima

Schermata di caricamento del file:

![Schermata di caricamento](public/Screenshot%202026-06-07%20at%2019.17.57.png)

Dashboard con il totale dei messaggi e i grafici a torta:

![Dashboard - totali e torte](public/Screenshot%202026-06-07%20at%2019.18.27.png)

Grafico a stella dei messaggi per mese e heatmap di attività:

![Dashboard - radar e heatmap](public/Screenshot%202026-06-07%20at%2019.20.57.png)

## Tecnologie utilizzate

- **React 19** — libreria per l'interfaccia utente
- **TypeScript** — linguaggio con tipizzazione statica
- **Vite** — build tool e dev server
- **Recharts** — libreria per i grafici (torte, radar, barre)
- **Tailwind CSS** — utility CSS
- **date-fns** — gestione delle date
- **ESLint** — analisi statica del codice

## Requisiti

- [Node.js](https://nodejs.org/) versione 20 o superiore
- npm (incluso con Node.js)

## Come avviare il progetto

Dopo aver clonato il repository:

```bash
git clone <url-del-repository>
cd capolavoro
```

Installare le dipendenze:

```bash
npm install
```

Avviare il server di sviluppo:

```bash
npm run dev
```

Aprire nel browser l'indirizzo mostrato nel terminale (di norma
`http://localhost:5173`).

## Comandi disponibili

| Comando           | Descrizione                                            |
| ----------------- | ------------------------------------------------------ |
| `npm run dev`     | Avvia il server di sviluppo con hot reload             |
| `npm run build`   | Compila il progetto per la produzione nella cartella `dist` |
| `npm run preview` | Mostra in anteprima la build di produzione             |
| `npm run lint`    | Esegue il controllo del codice con ESLint              |

## Come si usa

1. Esportare una chat di gruppo da WhatsApp **da iPhone** (con telefono in
   **italiano**) e **senza media**, ottenendo un file `.txt`.
2. Avviare l'app e trascinare (o selezionare) il file `.txt` nella schermata iniziale.
3. Consultare la dashboard con le statistiche, scegliendo l'anno da visualizzare.
