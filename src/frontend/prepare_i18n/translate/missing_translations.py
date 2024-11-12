import sys,re, json
from pathlib import Path

print(f"{sys.argv[1]}:")

with open (sys.argv[1]) as r:
    lines = r.read()

# match all instances of t("something"), but:
# - \W : before has to be not a word character (to avoid things like split("."))
# - ? non greedy
all = re.findall(r'\Wt\("(.*?)"\)', lines)
# print(all)

translations = {}
for file_path in Path("../public/locales/en").glob("*.json"):
    basename =  file_path.name.split(".")[0]
    loaded = json.loads(open(file_path).read())
    translations[basename] = loaded

# print (json.dumps(translations, indent=2))
for string in all:
    found = False
    for k, trans_array in translations.items():
        search_string=string
        if string.split(":")[0] == k:
            search_string = string.split(":")[1]
        for t in trans_array:
            if t == search_string:
                found = True
                break
    if not found:
        print(f"\t{string}")
