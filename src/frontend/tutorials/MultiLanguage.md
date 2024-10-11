# Gestione multilingua

La gestione delle stringhe nazionalizzate ha sempre avuto problemi: 

- in fase di sviluppo vengono aggiunte righe nei file json, ma spesso vengono messe su file di lingue diverse, o vengono inserite le stringhe in posizione diversa
- Il confronto tra file json è  complicato
- Il problema non rigurda solo i prompt nazionalizzati (le label de campi), ma anche le etichette associate ai valori dei pull down menu.
- Nel mondo Internet Computer conviene lavorare su Front End, senza creare tabelle di appoggio su backend
- E' necessario tradurre le stringhe anche in lingue non conosciute

In questo progetto ci sono 3 funzionalità principali:
- Recupero dei prompt dai file json esistenti (quelli che normalmente sono in .../public/locales/??/\*), che vengono inseriti in un file Excel, un prompt per riga, con colonne: nome del prompt, valore inglese e italiano
- Eventuale traduzione in una nuova lingua
- Estrazione dal file xls dei prompt nazionalizzaati

La directory di lavoro è .../src/frontend/prepare\_18n, sono script python in un virtual environment 

## Recupero
Con questa operazione vengon recuoerati  i file dossier.json dalle directory en, it, ecc dei sorgenti attuali, e vengono inseriti in un file dossier.xlsx

<div style="background-color:WhiteSmoke ;">

> . .my-venv/bin/activate
>
> python i18n2xls.py ../public/locales dossier
>
> deactivate

</div>


## Traduzione

## Estrazione

Con questa operazione, partendo dal file dossier.xlsx vengono creati i file dossier.json nelle directory en, it, ecc sotto ./locales.

Sarà poi necessario verificare i file prodotti e copiarli in ../public/locales

<div style="background-color:WhiteSmoke ;">

> . .my-venv/bin/activate
>
> python xls2i18n.py ./dossier.xlsx 
>
> deactivate

</div>

## Pull Down Menu nazionalizzati


