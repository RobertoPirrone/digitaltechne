import json, sys,re,os
from translate_google import translate_text

def json_tran(src_file,lang):
    with open (src_file, "r") as f:
        src=json.loads(f.read())

    if len(sys.argv) == 5:
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
