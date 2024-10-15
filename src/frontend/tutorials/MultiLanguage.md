# Gestione multilingua

La gestione delle stringhe nazionalizzate ha sempre avuto problemi: 

- in fase di sviluppo vengono aggiunte righe nei file json, ma spesso vengono messe su file di lingue diverse, o vengono inserite le stringhe in posizione diversa
- Il confronto tra file json è  complicato
- Il problema non rigurda solo i prompt nazionalizzati (le label de campi), ma anche le etichette associate ai valori dei pull down menu.
- Nel mondo Internet Computer conviene lavorare su Front End, senza creare tabelle di appoggio su backend
- E' necessario tradurre le stringhe anche in lingue non conosciute

In questo progetto ci sono 3 funzionalità principali:
- Recupero dei prompt dai file json esistenti (quelli che normalmente sono in .../public/locales/??/\*). I prompt vengono inseriti in un file Excel, un prompt per riga, con colonne: nome del prompt, valore inglese e italiano
- Eventuale traduzione in una nuova lingua
- Estrazione dal file xls dei prompt nazionalizzati:
    - file di traduzione standard
    - file specializzati per i pull down menu

La directory di lavoro è .../src/frontend/prepare\_18n, sono script python in un virtual environment 

## Recupero
Con questa operazione vengono recuperati  i file dossier.json dalle directory en, it, ecc dei sorgenti attuali, e vengono inseriti in un file dossier.xlsx

```
. .my-venv/bin/activate
python i18n2xls.py ../public/locales dossier
deactivate
```

## Traduzione

## Estrazione

Con questa operazione, partendo dal file dossier.xlsx vengono creati i file dossier.json nelle directory en, it, ecc sotto ./locales.

Sarà poi necessario verificare i file prodotti e copiarli in ../public/locales

```
. .my-venv/bin/activate
python xls2i18n.py ./dossier.xlsx 
deactivate
```

## Pull Down Menu nazionalizzati

I pulldown menu nazionalizzati vengono costruiti a partire da un file ad hoc e richiamando xsl2i18n con l'opzione da linea di comando **--pulldown** . In questo modo vengono creati dei file json utilizzati da useTranslate con queste caratteristiche:
- campo **Label**, nome del pulldown
-array **menuname_array** (p.es. tipofirma\_array), con gli elementi del pulldown

E quindi possono essere richiamati tramite il componente *SpecializedSelect*

<div style="background-color:WhiteSmoke ;">

    <SpecializedSelect defaultValue={""} name="tipotecnica" label={t("tipotecnica:Label")} what={"tipotecnica"} onChange={(e, v) => setTipotecnica(e.target.value)} />

</div>

# Struttura del file Excel
Il file xlsx (o anche .csv) ha 4 colonne:
- L1 chiave principale
- L2 eventuale chiave di secondo livello usata solo per i pulldown
- it prompt in italiano
- en prompt in inglese

Per  esempio partendo da un file tipotecnica.csv fatto in questo modo:

```
L1,L2,IT,EN
LABEL,,Tipo di Tecnica,Tecnique Type
EMBOSSING,,In Rilievo,Embossing
ETCHING,,Acquaforte,Etching
LITOGRAPHY,,Litografia,Litography
MIXED,,Tecnica Mista,Mixed Technique
WOODCUT,,Xilografia,Woodcut
PLASTER,L2,Gesso Italiano,English Plaster
,P2,Gesso 2, Plaster2
,P3,Gesso 3, Plaster3
```

Si ottengono file come questo: public/locales/en/tipotecnica.json 

```
{
  "tipotecnica_array": {
    "EMBOSSING": "Embossing",
    "ETCHING": "Etching",
    "LITOGRAPHY": "Litography",
    "MIXED": "Mixed Technique",
    "WOODCUT": "Woodcut",
    "PLASTER": {
      "Label": "English Plaster",
      "P2": " Plaster2",
      "P3": " Plaster3"
    }
  },
  "Label": "Tecnique Type"
}
```

Quindi il secondo livello richiede:
- una riga con chiave, costante "L2" e i prompt nazionalizzati
- n righe in cui manca la prima colonna, nella seconda c'è la chiave di secondo livello e poi i prompt nazionalizzati
