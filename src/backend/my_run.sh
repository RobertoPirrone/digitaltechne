#!/bin/bash
export DFX_NETWORK=ic
network="--ic"



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

echo "--- create table dossier"
fields='
    id INTEGER PRIMARY KEY,                               
    autore TEXT NOT NULL,                                
    nomeopera TEXT NOT NULL,                            
    ora_inserimento TEXT NOT NULL,                     
    username TEXT NOT NULL,                           
    luogoopera TEXT,
    private BOOLEAN,
    icon_uri TEXT NOT NULL,
    tipoopera TEXT NOT NULL
    '

    fields=$(echo $fields)
    sql_cmd=$(printf "create table dossier (%s)" "$fields")
    echo $sql_cmd
    dfx canister call $network backend execute "$sql_cmd"

echo "--- create dossier name index"
dfx canister call $network backend execute 'create index id on dossier(id)'

echo "--- create table documents"
fields='
    id INTEGER PRIMARY KEY,                               
    autore TEXT NOT NULL,                                
    ora_inserimento TEXT NOT NULL,                     
    title TEXT NOT NULL,                     
    versione INTEGER,
    dossieropera_id INTEGER NULL,                           
    filename TEXT NOT NULL,                           
    filesize INTEGER,
    mimetype TEXT NOT NULL,                           
    image_uri TEXT NOT NULL,
    tipo_documento TEXT NOT NULL
    '

    fields=$(echo $fields)
    sql_cmd=$(printf "create table documents (%s)" "$fields")
    echo $sql_cmd
    dfx canister call $network backend execute "$sql_cmd"

    exit 0
echo "--- insert dossier"
# dfx canister call backend execute 'insert into dossier (id, autore, nomeopera, ora_inserimento, username, icon_uri) values (1, "Elisabetta Villa", "Madalina Ghenea", "2024-03-18", "techne_seller", "https://techne-test.mostapps.it/ipfs/Qmc57JrLZiFybNG8T3Vq7x2AumLnXkz73Sq7ZL1EanFZLc" );'
# dfx canister call backend execute 'insert into dossier (id, autore, nomeopera, ora_inserimento, username, icon_uri) values (2, "Elisabetta Villa", "Scarlett Johansson", "2024-03-18", "techne_seller", "https://techne-test.mostapps.it/ipfs/QmfXAjR2sdZyRTv1xfEcaF6TLRqtKJUbpKMrFihDMHwtmw" );'
# dfx canister call backend execute 'insert into dossier (id, autore, nomeopera, ora_inserimento, username, icon_uri) values (3, "Elisabetta Villa", "Charlize Theron", "2024-03-18", "techne_seller", "https://techne-test.mostapps.it/ipfs/QmeWxE3KhYmm32f2YgtcVHf2A9p9VdoLGB7amviBaruJx7" );'

exit 0 
# Query:
dfx canister call backend dossier_query 'record {limit=10; offset=0; autore= "Elisabetta Villa"}'
dfx canister call backend  query "select max(id) from dossier"
# insert via JSON
# dfx canister call backend  dossier_insert '{ "autore": "Pinco Pallino", "nomeopera": "pippo paappo", "ora_inserimento": "2024-03-25", "username": "pluto", "icon_uri":"https://techne-test.mostapps.it/ipfs/QmeAV99r5LckFBAJxu5FUwhpMWjQ9XCSRd5cSC2w3k5vWJ" }'

