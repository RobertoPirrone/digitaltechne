import os, sys, re, logging, tempfile, datetime, json
from operator import itemgetter, attrgetter
from translate_google import translate_text

Log = logging.getLogger(__name__)

# loop sulle righe di un file xlsx già aperto restituisce json di key/value da mettere nei file di public/locales
def x2json_loop(xlsx, idx):
    '''
    xlsx: array di righe del file xls
    idx: colonna su cui si lavora
    mode:   * x2json restituisce json di key/value da mettere nei file di public/locales
            * x2lang richiama google translate per creare la colonna di una nuova lingua
    '''
    new_L2_key=None
    for in_rows in [xlsx]:

        label = in_rows[2][idx].value
        Log.error(f"TITLE: {label}")
        trans_dict = {}
        L2_dict={}
        for s in in_rows.iter_rows(min_row=3):
            Log.error(s)
            L1=s[0].value
            L2=s[1].value
            main_value=s[2].value
            cur_value=s[idx].value
            # Log.error(f"For s: {L1=} {L2=}, {main_value=} {cur_value=}")

            if L1 is not None and L2 is not None and L2 == "L2":
                # inizia un livello 2
                print ("Inizio L2, ", L1)
                if new_L2_key is not None:
                    # sputo fuori l'attuale L2  e reinizializzo
                    trans_dict[new_L2_key] = L2_dict
                # Per i pull down bilivello posso nazionalizzare anche il nome del gruppo
                L2_dict={}
                new_L2_key = L1
                # dict annidati non di tipo pulldown, la label non esiste
                print(cur_value, type(cur_value))
                if  cur_value is not None:
                    L2_dict["Label"]=cur_value
                else:
                    print("ZZZZZZZZZZZZZZZZZZZZZZ NOne")
                
            elif  L1 is None and L2 is None:
                break

            elif L2 is None: 
                # livello 1
                print(cur_value)
                trans_dict[L1] = cur_value

            elif  L1 is None:
                # siamo dentro un L2 
                if  cur_value is not None:
                    L2_dict[L2] = cur_value

            else:
                Log.error(f"ELSE {L1}, {L2}, main value {main_value}, cur_value {cur_value}" )

        if new_L2_key is not None:
            # ho ancora un dict in canna
            print(f"esco {new_L2_key}")
            trans_dict[new_L2_key] = L2_dict

        return trans_dict


# 
def x2lang_loop(xlsx, lang, rows):
    '''
    xlsx: array di righe del file xls
    idx: colonna su cui si lavora
            * x2lang richiama google translate per creare la colonna di una nuova lingua
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
    col_idx=5
    xlsx.cell(row=i, column=col_idx).value = lang.upper()
    for t in translated:
        i+=1
        if t != "None":
            xlsx.cell(row=i, column=col_idx).value = t
