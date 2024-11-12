# -*- coding: utf-8 -*-
# from a csv/ xlsx file extract the translations in locales/<language>/<tablename>.json

import os, sys, re, logging, tempfile, datetime, json
import csv
from openpyxl import Workbook, load_workbook
import subprocess
from operator import itemgetter, attrgetter
from xlsx_subr import x2json_loop

Log = logging.getLogger(__name__)
Log.error(sys.argv)

def xls2i18n():
    Log.error("xls2i18n")
    pulldown=False
    if sys.argv[1] == "--pulldown":
        pulldown=True
        fname=sys.argv[2]
    else:
        fname=sys.argv[1]

    if '/' not in fname:
        fname=f'./{fname}'

    dirname, tail = os.path.split(fname)
    basename = tail.split(".")[0]
    suffix = tail.split(".")[1]
    xlsx_name = f"{dirname}/{basename}.xlsx"
    Log.error(f"dirname: {dirname}, basename {basename}")
    try:

        rm_xlsx=False
        # openpyxl non lavora sui csv
        if suffix == "csv":
            wb = Workbook()
            ws = wb.active
            ws.title = "Sheet"
            data = open(fname)
            csv_data = list(csv.reader(data)) #Method used to open and read a csv file
            for i in csv_data:
                ws.append(i)
            wb.save(xlsx_name)
            rm_xlsx=True

        report = ""
        xlsx = load_workbook(filename=xlsx_name)['Sheet']
       
        # italiano e inglese ci sono sempre, ma lasciamo spazio a altro
        header = xlsx[1]
        langs = [ header[2].value, header[3].value]
        if len(header) ==5:
            langs.append(header[4].value)
        if len(header) ==6:
            langs.append(header[5].value)
        idx=1

        for lang in langs:
            lower_lang=lang.lower()
            new_L2_key=None
            idx+=1
            trans_dict = x2json_loop(xlsx, idx)

            Log.error(trans_dict)
            if pulldown:
                out_dict = {f"{basename}_array": trans_dict}
                out_dict['Label'] = label
            else:
                out_dict = trans_dict

            # jtrans=json.dumps({f"{basename}_array": trans_dict},ensure_ascii=False,indent=2)
            jtrans=json.dumps(out_dict,ensure_ascii=False,indent=2)
            # no pun intended
            bjtrans=jtrans.encode('utf-8')
            out_dir=f"locales/{lower_lang}"
            try:
                os.makedirs(out_dir)
            except FileExistsError:
                Log.error(f"{out_dir} already exists")

            with open (f"{out_dir}/{basename}.json", "wb") as f:
                f.write(bjtrans)

            if rm_xlsx:
                os.remove(xlsx_name)

    except Exception as e:
        Log.error(f"xls2i18n error: {e}")

if __name__ == "__main__":
    xls2i18n()

