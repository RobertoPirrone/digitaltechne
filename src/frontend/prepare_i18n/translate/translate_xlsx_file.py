import os, sys, re, logging, tempfile, datetime, json
import csv
from openpyxl import Workbook, load_workbook
import subprocess
from operator import itemgetter, attrgetter
from xlsx_subr import x2lang_loop

def xlsx_tran(fname, lang, rows):

    dirname, tail = os.path.split(fname)
    basename = tail.split(".")[0]
    suffix = tail.split(".")[1]
    xlsx_name = f"{dirname}/{basename}.xlsx"

    wb = load_workbook(filename=xlsx_name)
    xlsx = wb['Sheet']
   
    # italiano e inglese ci sono sempre, ma lasciamo spazio a altro
    header = xlsx[1]
    x2lang_loop(xlsx,lang, rows)
    wb.save('./suca.xlsx')
