# deve già esistere una cartuccia con id 1 (integer)
if [ $# -eq 1 -a x$1 = "x--ic" ] ; then
    network="--ic"
    dfx identity use NuovaIdentitaRobi
    export DFX_NETWORK=ic
else
    network=""
    dfx identity use default
fi
echo Uso network $network, con identity $(dfx identity whoami)

insert_cartridge() {
    id=$1
    uuid=$1
    dna_text='[\n  {\n    "Locus": "D8S1179",\n    "Alleli": "8, 9 10, 11, 12, 13, 14, 15, 16, 17, 18, 19",\n    "Esempio di un profilo DNA": 11.13\n  },\n  {\n    "Locus": "D21S11",\n    "Alleli": "24, 24.2, 25, 26, 27, 28, 28.2, 29, 29.2, 30, 30.2, 31, 31.2, 32, 32.2, 33, 33.2, 34, 34.2, 35, 35.2, 36, 37, 38",\n    "Esempio di un profilo DNA": "29,31.2"\n  },\n  {\n    "Locus": "D7S820",\n    "Alleli": "6, 7, 8, 9, 10, 11, 12, 13, 14, 15",\n    "Esempio di un profilo DNA": 6.15\n  },\n  {\n    "Locus": "CSF1PO",\n    "Alleli": "6, 7, 8, 9, 10, 11, 12, 13, 14, 15",\n    "Esempio di un profilo DNA": 8.14\n  },\n  {\n    "Locus": "D3S1358",\n    "Alleli": "12, 13, 14, 15, 16, 17, 18, 19",\n    "Esempio di un profilo DNA": 13.16\n  },\n  {\n    "Locus": "TH01",\n    "Alleli": "4, 5, 6, 7, 8, 9, 9.3, 10, 11, 13.3",\n    "Esempio di un profilo DNA": "9,13.3"\n  },\n  {\n    "Locus": "D13S317",\n    "Alleli": "8, 9, 10, 11, 12, 13, 14, 15",\n    "Esempio di un profilo DNA": 9.14\n  },\n  {\n    "Locus": "D16S539",\n    "Alleli": "5, 8, 9, 10, 11, 12,13, 14, 15",\n    "Esempio di un profilo DNA": 8.13\n  },\n  {\n    "Locus": "D2S1338",\n    "Alleli": "15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28",\n    "Esempio di un profilo DNA": 21.28\n  },\n  {\n    "Locus": "D19S433",\n    "Alleli": "9, 10, 11, 12, 12.2, 13, 13.2, 14, 14.2, 15, 15.2, 16, 16.2, 17, 17.2",\n    "Esempio di un profilo DNA": "12.2,13.2"\n  },\n  {\n    "Locus": "vWA",\n    "Alleli": "11,12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24",\n    "Esempio di un profilo DNA": 19.21\n  },\n  {\n    "Locus": "TPOX",\n    "Alleli": "6, 7, 8, 9, 10, 11, 12, 13",\n    "Esempio di un profilo DNA": 11.13\n  },\n  {\n    "Locus": "D18S51",\n    "Alleli": "7, 9, 10, 10.2, 11, 12, 13, 13.2, 14, 14.2, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27",\n    "Esempio di un profilo DNA": 9.25\n  },\n  {\n    "Locus": "Amelogenin",\n    "Alleli": "X, Y",\n    "Esempio di un profilo DNA": "X,Y"\n  },\n  {\n    "Locus": "D5S818",\n    "Alleli": "7, 8, 9, 10, 11, 12, 13, 14, 15, 16",\n    "Esempio di un profilo DNA": 12.15\n  },\n  {\n    "Locus": "FGA",\n    "Alleli": "17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 26.2, 27, 28, 29, 30, 30.2, 31.2, 32.2, 33.2, 42.2, 43.2, 44.2, 45.2, 46.2, 47.2, 48.2, 50.2, 51.2",\n    "Esempio di un profilo DNA": "20,26.2"\n  }\n]'
    dna_file_asset="/uploads/785cddc7-2afd-4850-87b5-1c2fd155fd2b.pdf"
    inserted_by="tfjej-ztqzc-5a5c7-hc6rx-7qcs2-n6we6-glwze-swrg7-iz5ft-vvuim-lqe"
    lab_name='Laboratorio CNR Catania'
    insert_time=$(date -Iseconds)        
    note="xx"

    # sql_cmd="$(printf "insert into cartridge (id, uuid, dna_text, dna_file_asset, inserted_by, lab_name, insert_time, note) values ( '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s' )" $id $uuid "$dna_text" $dna_file_asset $inserted_by "$lab_name" $insert_time $note)"
    sql_cmd="$(printf "insert into cartridge (id, uuid, dna_text, dna_file_asset, inserted_by, lab_name, insert_time, note) select '%s', '%s', dna_text, dna_file_asset, inserted_by, '%s', '%s', '%s' from cartridge where id = 1" $id $uuid "$lab_name" $insert_time $note)"
   
    echo "$sql_cmd"
    dfx canister call $network backend execute "$sql_cmd"
}

for i in {2..10} ; do
    insert_cartridge $i
done

