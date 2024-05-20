# deve già esistere una cartuccia con id 1 (integer)
if [ $# -eq 1 -a x$1 = "x--ic" ] ; then
    network="--ic"
    dfx identity use NuovaIdentitaRobi
    export DFX_NETWORK=ic
    inserted_by="k5j7t-qujrn-uedz6-yddl2-xp3sf-t4t3r-sktxx-rv6lg-s4rjc-ujm7b-hae"
    owned_by=$inserted_by
else
    network=""
    dfx identity use default
    inserted_by="ckvjg-r3bro-7fbmk-sicy4-nqq2m-iiyoq-sf3zk-c63ul-wixjn-lqflm-5ae"
    owned_by=$inserted_by
fi
echo Uso network $network, con identity $(dfx identity whoami)

insert_cartridge() {
    uuid=$(uuidgen)
    dna_file_asset="NO file"
    dna_text='
Locus	Alleli				Esempio di un profilo DNA
D8S1179	8, 9 10, 11, 12, 13, 14, 15, 16, 17, 18, 19				11.13
D21S11	24, 24.2, 25, 26, 27, 28, 28.2, 29, 29.2, 30, 30.2, 31, 31.2, 32, 32.2, 33, 33.2, 34, 34.2, 35, 35.2, 36, 37, 38				29,31.2
D7S820	6, 7, 8, 9, 10, 11, 12, 13, 14, 15				6.15
CSF1PO	6, 7, 8, 9, 10, 11, 12, 13, 14, 15				8.14
D3S1358	12, 13, 14, 15, 16, 17, 18, 19				13.16
TH01	4, 5, 6, 7, 8, 9, 9.3, 10, 11, 13.3				9,13.3
D13S317	8, 9, 10, 11, 12, 13, 14, 15				9.14
D16S539	5, 8, 9, 10, 11, 12,13, 14, 15				8.13
D2S1338	15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28				21.28
D19S433	9, 10, 11, 12, 12.2, 13, 13.2, 14, 14.2, 15, 15.2, 16, 16.2, 17, 17.2				12.2,13.2
vWA	11,12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24				19.21
TPOX	6, 7, 8, 9, 10, 11, 12, 13				11.13
D18S51	7, 9, 10, 10.2, 11, 12, 13, 13.2, 14, 14.2, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27				9.25
Amelogenin	X, Y				X,Y
D5S818	7, 8, 9, 10, 11, 12, 13, 14, 15, 16				12.15
FGA	17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 26.2, 27, 28, 29, 30, 30.2, 31.2, 32.2, 33.2, 42.2, 43.2, 44.2, 45.2, 46.2, 47.2, 48.2, 50.2, 51.2				20,26.2';

    lab_name='Laboratorio CNR Catania'
    insert_time=$(date -Iseconds)        
    purchase_time=$(date -Iseconds -v +2M)        
    note="xx"

    sql_cmd="$(printf "insert into cartridge (uuid, dna_text, dna_file_asset, inserted_by, lab_name, insert_time, purchase_time, note) values ( '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s' )"  $uuid "$dna_text" "$dna_file_asset" "$inserted_by" "$lab_name" $insert_time $purchase_time $note)"
    echo "$sql_cmd"
    dfx canister call $network backend execute "$sql_cmd"

    sql_cmd="$(printf "insert into cartridge_use (uuid, cartridge_uuid, purchase_time, owned_by ) values ( '%s', '%s', '%s', '%s' )"  $uuid $uuid $purchase_time "$owned_by" )"
    echo "$sql_cmd"
    dfx canister call $network backend execute "$sql_cmd"
}

# insert_cartridge  0
# exit 0



for i in {2..12} ; do
    insert_cartridge $i
done

