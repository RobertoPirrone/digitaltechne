import json, sys,re,os
from translate_google import translate_text

# MAIN
if not (len(sys.argv) == 4):
    print(f"\tUso: python {sys.argv[0]} target_lang src_file dst_file")
    print("\tfrom a text file (usually a markup/ rst document) creates a new file in a different language")
    exit (1)

lang=sys.argv[1]
src_file=sys.argv[2]
tgt_file=sys.argv[3]

with open (src_file, "r") as f:
    src_content=[f.read()]

translated = translate_text(lang, src_content)[0]
with open (tgt_file, "w") as f:
    f.write(translated)

