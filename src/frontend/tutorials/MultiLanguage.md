# Languages Handling

The management of nationalized strings has always had problems:

- during development, lines are added to the json files, but they are often put on files of different languages, or the strings are inserted in different positions
- Comparison between json files is complicated
- The problem does not only concern the nationalized prompts (the field labels), but also the labels associated with the values of the pull down menus.
- In the Internet Computer world it is better to work on the Front End, without creating support tables on the backend
- It is necessary to translate the strings even in unknown languages

In this project there are 4 main features:
- Retrieval of prompts from existing json files (those that are normally in .../public/locales/??/\*). The prompts are inserted into an Excel file, one prompt per line, with columns: prompt name, English and Italian value
- Look for missing translation strings
- Possible translation into a new language
- Extraction from the xls file of the nationalized prompts:
    - standard translation file
    - specialized files for pull down menus

Please note that the python script must be run in a venv environment, for instance:

```
. .my-venv/bin/activate
python i18n2xls.py ../public/locales dossier
deactivate
```


The working directory is .../src/frontend/prepare\_18n, they are python scripts in a virtual environment

## Recovery
With this operation, the dossier.json files are recovered from the en, it, etc. directories of the current sources, and are inserted into a dossier.xlsx file

```
python i18n2xls.py ../public/locales dossier
```

## Missing translations

Sometimes it can be useful to check if there is a mismatch between the JSX source files in .../src and the translation files of .../public/locales/

So there is a small script that checks exactly that.

It can be run either on a single file, i.e.:

```
    python missing_translations.py ../SRC/Admin.jsx
```

or recursively:

```
    find ../src/ -name \*.jsx -exec python missing_translations.py '{}' \;
```

## Translation

## Extraction

With this operation, starting from the dossier.xlsx file, the dossier.json files are created in the en, it, etc. directories under ./locales.

It will then be necessary to verify the produced files and copy them to ../public/locales

```
. .my-venv/bin/activate
python xls2i18n.py ./dossier.xlsx
deactivate
```

## Nationalized Pull Down Menus

Pull down menus should appear in the current language, uat the keys associated with the prompts must be the same in any language

Json files are built starting from an ad hoc file (i..e. a file for each menu) and calling xsl2i18n with the command line option **--pulldown** . This creates json files used by useTranslate with these characteristics:
- field **Label**, name of the pulldown
- array **menuname_array** (e.g. tipofirma\_array), with the elements of the pulldown

And then they can be called via the *SpecializedSelect* component

<div style="background-color:WhiteSmoke ;">

<SpecializedSelect defaultValue={""} name="tipotecnica" label={t("tipotecnica:Label")} what={"tipotecnica"} onChange={(e, v) => setTipotecnica(e.target.value)} />

</div>

# Excel file structure
The xlsx file (or also .csv) has 4 columns:
- L1 main key
- L2 possible second level key used only for pulldowns
- it prompt in Italian
- en prompt in English

For example starting from a file tipotecnica.csv made like this:

```
L1,L2,IT,EN
LABEL,,Tecnique Type,Tecnique Type
EMBOSSING,,In Rilievo,Embossing
ETCHING,,Acquaforte,Etching
LITOGRAPHY,,Litografia,Litography
MIXED,,Tecnica Mista,Mixed Technique
WOODCUT,,Xilografia,Woodcut
PLASTER,L2,Gesso Italiano,English Plaster
,P2,Gesso 2, Plaster2
,P3,Gesso 3, Plaster3
```

You get files like this: public/locales/en/tipotecnica.json

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

So the second level requires:
- a row with key, constant "L2" and the nationalized prompts
- n rows where the first column is missing, in the second there is the second level key and then the nationalized prompts
