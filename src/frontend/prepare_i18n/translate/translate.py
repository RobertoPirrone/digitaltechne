# -*- coding: utf-8 -*-
import json, sys,re,os
# pip3 install google-cloud-translate==2.0.1
# ricevo: 
#   * lingua
#   * file di output
#   * Opzionale: righe del file italiano in più rispetto al vecchio tag git
# quindi intervengo solo se:
# la traduzione non esiste
# la traduzione esiste già, ma in itialiano è cambiata la string
# rimane il problema di righe eliminate del tutto, che rimangono nelle traduzioni

from translate_json_file import json_tran
from translate_xlsx_file import xlsx_tran

if not (len(sys.argv) == 4 or len(sys.argv) == 5):
    print("Uso: sys.argv[0] lang [JSON,XLSX] src_file_path [rows]")
    print("target_file will be locales/lang/file")
    exit (1)
lang=sys.argv[1]
file_type=sys.argv[2]
src_file=sys.argv[3]

if len(sys.argv) == 5:
    rows=sys.argv[4]
else:
    rows=""

if file_type == "JSON":
    json_tran(src_file, lang, rows)
if file_type == "XLSX":
    xlsx_tran(src_file, lang, rows)
