#!/bin/bash
if [ $# -eq 1 -a $1 = "--ic" ] ; then
    network="--ic"
    dfx identity use NuovaIdentitaRobi
    export DFX_NETWORK=ic
else
    network=""
    dfx identity use default
fi
echo Uso network $network, con identity $(dfx identity whoami)

create_table() {
    table=$1
    fields="$2"

    echo "--- create table $table"
    sql_cmd=$(printf "drop table %s" $table)
    dfx canister call $network backend execute "$sql_cmd"

    fields=$(echo $fields)
    sql_cmd=$(printf "create table %s (%s)" $table "$fields")
    # echo $sql_cmd
    dfx canister call $network backend execute "$sql_cmd"
}

fields='
    id INTEGER PRIMARY KEY,                               
    uuid TEXT NOT NULL,                                
    cartridge_uuid TEXT NOT NULL,                                
    purchase_time TEXT NOT NULL,
    owned_by TEXT NOT NULL,
    usage_time TEXT,
    dossier_id TEXT
    '
    create_table cartridge_use "$fields"

fields='
    id INTEGER PRIMARY KEY,                               
    uuid TEXT NOT NULL,                                
    dossier_id TEXT NOT NULL,                                
    inserted_by TEXT NOT NULL,
    ora_inserimento TEXT NOT NULL,
    mark_dull_code TEXT NOT NULL,                                
    mark_position TEXT NOT NULL,                                
    note TEXT NOT NULL
    '
    create_table artwork_mark "$fields"

fields='
    id INTEGER PRIMARY KEY,                               
    uuid TEXT NOT NULL,                                
    dna_text TEXT NOT NULL,                            
    dna_file_asset TEXT NOT NULL,                           
    inserted_by TEXT NOT NULL,
    lab_name TEXT NOT NULL,
    insert_time TEXT NOT NULL,
    purchase_time TEXT,
    note TEXT NOT NULL
    '
    create_table cartridge "$fields"

fields='
    id INTEGER PRIMARY KEY,                               
    uuid TEXT NOT NULL,                                
    autore TEXT NOT NULL,                                
    nomeopera TEXT NOT NULL,                            
    ora_inserimento TEXT NOT NULL,                     
    inserted_by TEXT NOT NULL,                           
    luogoopera TEXT,
    private BOOLEAN,
    icon_uri TEXT NOT NULL,
    tipoopera TEXT NOT NULL,
    has_artwork_mark BOOLEAN
    '
    create_table dossier "$fields"
    # echo "--- create dossier name index"
    # dfx canister call $network backend execute 'create index id on dossier(id)'

fields='
    id INTEGER PRIMARY KEY,                               
    uuid TEXT NOT NULL,                                
    autore TEXT NOT NULL,                                
    ora_inserimento TEXT NOT NULL,                     
    title TEXT NOT NULL,                     
    versione INTEGER,
    dossieropera_id INTEGER NULL,                           
    filename TEXT NOT NULL,                           
    filesize INTEGER,
    mimetype TEXT NOT NULL,                           
    image_uri TEXT NOT NULL,
    inserted_by TEXT NOT NULL,
    tipo_documento TEXT NOT NULL
    '
    create_table documents "$fields"

    exit 0

echo "--- create table tipoopera_codes"
fields='
    id INTEGER PRIMARY KEY,                               
    code TEXT NOT NULL
    '
    fields=$(echo $fields)
    sql_cmd=$(printf "create table tipoopera_code (%s)" "$fields")
    echo $sql_cmd
    dfx canister call $network backend execute "$sql_cmd"
    dfx canister call $network backend execute 'insert into tipoopera_code (code) values ("B/W DIGITAL_PHOTO");'
    dfx canister call $network backend execute 'insert into tipoopera_code (code) values ("COLOUR DIGITAL_PHOTO");'
    dfx canister call $network backend execute 'insert into tipoopera_code (code) values ("CANVASS");'
    dfx canister call $network backend execute 'insert into tipoopera_code (code) values ("PAPER");'


exit 0 
echo "--- insert dossier"
# dfx canister call backend execute 'insert into dossier (id, autore, nomeopera, ora_inserimento, username, icon_uri) values (1, "Elisabetta Villa", "Madalina Ghenea", "2024-03-18", "techne_seller", "https://techne-test.mostapps.it/ipfs/Qmc57JrLZiFybNG8T3Vq7x2AumLnXkz73Sq7ZL1EanFZLc" );'

# Query:
dfx canister call backend dossier_query 'record {limit=10; offset=0; autore= "Elisabetta Villa"}'
dfx canister call backend  query "select max(id) from dossier"
# insert via JSON
# dfx canister call backend  dossier_insert '{ "autore": "Pinco Pallino", "nomeopera": "pippo paappo", "ora_inserimento": "2024-03-25", "username": "pluto", "icon_uri":"https://techne-test.mostapps.it/ipfs/QmeAV99r5LckFBAJxu5FUwhpMWjQ9XCSRd5cSC2w3k5vWJ" }'
