import os, sys, re, logging, tempfile, datetime, json
import csv
from openpyxl import Workbook, load_workbook
import subprocess
from operator import itemgetter, attrgetter
from xlsx_subr import x2lang_loop

def x2lang_loop(xlsx, lang, col_idx):
    '''
    xlsx: array di righe del file xls
    lang: target language
    returns: a new column in the xlsx worksheet
    '''
    
    new_L2_key=None
    it_values= []
    for s in xlsx.iter_rows(min_row=2):
        it_value=s[2].value if s[2].value is not None else "None"
        it_values.append(it_value)

    # print (it_values)
    text = "\n".join(it_values)
    print (f"{text=}")
    translated = translate_text(lang, it_values)
    print (f"{translated=}")


    i=1
    xlsx.cell(row=i, column=col_idx).value = lang.upper()
    for t in translated:
        i+=1
        if t != "None":
            xlsx.cell(row=i, column=col_idx).value = t

# MAIN
if not (len(sys.argv) != 3:
    print(f"Uso: python {sys.argv[0]} target_lang src_file_path")
    print("creates a new column in the xlsx file, with the translations for the target language")
    print("the file is modified in place, but a backup copy is held in ./save")
    exit (1)

lang=sys.argv[1]
src_file=sys.argv[2]

dirname, tail = os.path.split(fname)
basename = tail.split(".")[0]
suffix = tail.split(".")[1]
xlsx_name = f"{dirname}/{basename}.xlsx"

wb = load_workbook(filename=xlsx_name)
wb.save('./suca.xlsx')
xlsx = wb['Sheet']

header = xlsx[1]
x2lang_loop(xlsx,lang, col_idx)
wb.save(xlsx_name)

