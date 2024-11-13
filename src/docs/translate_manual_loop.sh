#!/bin/bash
# loops trough the docs directory, translating the files

script_dir=../../frontend/prepare_i18n/translate
export GOOGLE_APPLICATION_CREDENTIALS=$script_dir/google_key.json

# untranslated files only, also excluding hand made index files
files=$(find . -name \*.rst ! -path "./*_??.rst" ! -path "./index.rst" ! -path "./USER_MANUAL/user_manual.rst")
langs="fr de it"
langs="de"

for file in $files ; do
    for lang in $langs ; do
        base=$(basename $file .rst )
        dir=$(dirname $file)
        tgt="$dir/${base}_${lang}.rst"
        bck=$tgt.bck
        echo python $script_dir/text_translate.py $lang $file $tgt
        python $script_dir/text_translate.py $lang $file $tgt
        # google translate mangia i due blank iniziali
        sed -i .bck  -e 's/^:width/  :width/g'  $tgt
        sed -i .bck -e 's/^:alt/  :alt/g' $tgt
        # mediamente l'inglese è più conciso, anche nei titoli
        sed -i .bck  -e '1,$s/###/##########################################/' $tgt
        sed -i .bck  -e '1,$s/___/__________________________________________/' $tgt
        sed -i .bck  -e '1,$s/===/=========================================/' $tgt
        rm $bck
        exit 0
    done
done
