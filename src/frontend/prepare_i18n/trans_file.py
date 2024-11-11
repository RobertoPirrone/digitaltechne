# -*- coding: utf-8 -*-
import json, sys,re
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

    Target must be an ISO 639-1 language code. (e.g. it, en,...)
    text is newline separated string of strings
    See https://g.co/cloud/translate/v2/translate-reference#supported_languages
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
    print("Uso: sys.argv[0] lang target_file [rows]")
    exit (1)
lang=sys.argv[1]
tgt_file=sys.argv[2]

with open (tgt_file, "r") as f:
    tgt=json.loads(f.read())

if len(sys.argv) == 4:
    rows=sys.argv[3]
else:
    rows=tgt

keys=[]
it_values=[]

for key, it_value in rows.items():
    print(key)
    if type(it_value) == dict:
        print("DICT")
        for dict_key, dict_it_value in it_value.items():
            keys.append(f"DICT-{key}-{dict_key}")
            it_values.append(dict_it_value)
    else:
        keys.append(key)
        it_values.append(it_value)

# da array di stringhe a unica stringa con EOL
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
    if "DICT" in k:
        if m := re.match('DICT-(.*?)-(.*)',k):
            L1=m[1]
            L2=m[2]
            print(f"{L1=}, {L2=}")
            if L1 not in tgt_dict:
                tgt_dict[L1] = {}
            tgt_dict[L1][L2] = v
        else:
            print(f"KOOOO: {k}")

    else:
        tgt_dict[k] = v


print("FINITO")
print (json.dumps(tgt_dict, ensure_ascii=False, indent=2))
exit(0)

with open (tgt_file, "w") as f:
    f.write(json.dumps(tgt_dict, ensure_ascii=False, indent=2))
