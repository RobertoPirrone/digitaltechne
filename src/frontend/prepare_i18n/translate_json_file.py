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


def translate_text(target, text):
    # return re.sub('\n','\nAA', text)
    """Translates text into the target language.

    * target must be an ISO 639-1 language code. (e.g. it, en,...). See https://g.co/cloud/translate/v2/translate-reference#supported_languages
    * text is a newline separated string of strings

    """
    import six
    from google.cloud import translate_v2 as translate

    translate_client = translate.Client()

    if isinstance(text, six.binary_type):
        text = text.decode("utf-8")

    # Text can also be a sequence of strings, in which case this method
    # will return a sequence of results for each text.
    # bisogna usare _text (di default è html)
    result = translate_client.translate(text, target_language=target, format_='text')


    print(f"Text: {result["input"]}")
    print(f"Translation: {result["translatedText"]}")
    print(f"Detected source language: {result["detectedSourceLanguage"]}")


    return (result["translatedText"])

if not (len(sys.argv) == 3 or len(sys.argv) == 4):
    print("Uso: sys.argv[0] lang src_file_path [rows]")
    print("target_file will be locales/lang/file")
    exit (1)
lang=sys.argv[1]
src_file=sys.argv[2]

with open (src_file, "r") as f:
    src=json.loads(f.read())

if len(sys.argv) == 4:
    rows=sys.argv[3]
else:
    rows=src

keys=[]
it_values=[]

for key, it_value in rows.items():
    print(key, it_value)
    if type(it_value) == dict:
        print(f"DICT: {it_value.items()}")
        for dict_key, dict_it_value in it_value.items():
            if type(dict_it_value) == dict:
                for inner_dict_key, inner_dict_it_value in dict_it_value.items():
                    keys.append(f"DICT3-{key}-{dict_key}-{inner_dict_key}")
                    it_values.append(inner_dict_it_value)
            else:
                keys.append(f"DICT-{key}-{dict_key}")
                it_values.append(dict_it_value)
    else:
        keys.append(key)
        it_values.append(it_value)

# da array di stringhe a unica stringa con EOL
print("XXXXit_values")
print(it_values)
print(keys)
translated = translate_text(lang, "\n".join(it_values))
print(f"{keys=}\n {translated=}")

# da stringa con EOL a array
trans_list = [ t for t in translated.split('\n')]
print(f"{translated=}")

# unisco le due liste in una sola, i dict interni rimangono appiattiti
tgt = list(zip(keys,trans_list))

# da lista a dict, ricostruendo eventuali dict interni
tgt_dict = {}
for k,v in tgt:
    print(k,v)
    if "DICT3" in k:
        if m := re.match('DICT3-(.*?)-(.*?)-(.*)',k):
            L1=m[1]
            L2=m[2]
            L3=m[3]
            print(f"{L1=}, {L2=}, {L3=}")
            if L1 not in tgt_dict:
                tgt_dict[L1] = {}
            if L2 not in tgt_dict[L1]:
                tgt_dict[L1][L2] = {}
            tgt_dict[L1][L2][L3] = v
        else:
            print(f"KOOOO level 3: {k}")
    elif "DICT" in k:
        if m := re.match('DICT-(.*?)-(.*)',k):
            L1=m[1]
            L2=m[2]
            print(f"{L1=}, {L2=}")
            if L1 not in tgt_dict:
                tgt_dict[L1] = {}
            tgt_dict[L1][L2] = v
        else:
            print(f"KOOOO level 2: {k}")

    else:
        tgt_dict[k] = v


basename=os.path.basename(src_file)
print(basename)
print (json.dumps(tgt_dict, ensure_ascii=False, indent=2))
try:
    os.mkdir(f"locales/{lang}")
except Exception as e:
    pass

tgt_file=f"locales/{lang}/{basename}"
with open (tgt_file, "w") as f:
    f.write(json.dumps(tgt_dict, ensure_ascii=False, indent=2))
