#!bin/bash
if [ $# -eq 1 -a x$1 = "x--ic" ] ; then
    network="--ic"
    dfx identity use MainnetRobi
    export DFX_NETWORK=ic
else
    network=""
    dfx identity use NuovaIdentitaRobi
fi
echo Uso network $network, con identity $(dfx identity whoami)

create_table() {
    table=$1
    fields="$2"

    echo "--- create table $table"
    sql_cmd=$(printf "drop table if exists %s" $table)
    dfx canister call $network backend execute "$sql_cmd"

    # fields=$(echo $fields)
    sql_cmd=$(printf "create table %s (%s)" $table "$fields")
    dfx canister call $network backend execute "$sql_cmd"
}

# TRACK
fields=$(cat <<'EOF'
id INTEGER PRIMARY KEY,
principal TEXT NOT NULL,
operation TEXT NOT NULL,
system_time TEXT NOT NULL
EOF
)
    create_table track "$fields"
    dfx canister call $network backend execute 'create index track_id on track(id)'
    exit 0

# DOSSIER 
fields=$(cat <<'EOF'
id INTEGER PRIMARY KEY,                               
uuid TEXT NOT NULL,                                
autore TEXT NOT NULL,                                
nomeopera TEXT NOT NULL,                            
ora_inserimento TEXT NOT NULL,                     
inserted_by TEXT NOT NULL,                           
tipotecnica TEXT CHECK( tipotecnica IN ('EMBOSSING', 'ETCHING', 'LITOGRAPHY', 'MIXED', 'WOODCUT', 'PLASTER' ) ) NOT NULL,
annoopera u64 CHECK (annoopera between 1950 and 1990) NOT NULL,
numero_totale_copie INTEGER NOT NULL,
dimensions TEXT NOT NULL,
private BOOL default false,
icon_uri TEXT NOT NULL,
tipofirma TEXT CHECK( tipofirma IN ('SIGNED', 'NOT_SIGNED', 'ARTIST_PROOF' ) ),
tiposupporto TEXT CHECK( tiposupporto IN ('PAPER', 'CANVAS', 'ACRYLIC' ) ),
has_artwork_mark BOOLEAN,
master_uuid TEXT NOT NULL,
sheet_identifier TEXT NOT NULL
EOF
)

    create_table dossier "$fields"
    dfx canister call $network backend execute 'create index id on dossier(id)'


# RBAC
fields='
    id INTEGER PRIMARY KEY,
    principal TEXT NOT NULL UNIQUE,
    friendly_name TEXT,
    view_opera_ok BOOLEAN,
    add_opera_ok BOOLEAN,
    dna_mark_ok BOOLEAN,
    add_dna_ok BOOLEAN,
    admin_ok BOOLEAN
    '
    create_table rbac "$fields"
    # per rendere unique un campo su db esistente:
    #   dfx canister call backend  execute "CREATE UNIQUE INDEX ux_rbac_principal ON rbac(principal);"


# CARTRIDGE_USE
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

# ARTWORK_MARK
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

# CARTRIDGE
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


# DOCUMENTS
fields='
    id INTEGER PRIMARY KEY,                               
    uuid TEXT NOT NULL,                                
    autore TEXT NOT NULL,                                
    ora_inserimento TEXT NOT NULL,                     
    title TEXT NOT NULL,                     
    versione INTEGER,
    filename TEXT NOT NULL,                           
    filesize INTEGER,
    mimetype TEXT NOT NULL,                           
    image_uri TEXT NOT NULL,
    inserted_by TEXT NOT NULL,
    tipo_documento TEXT NOT NULL,
    master_uuid TEXT NOT NULL
    '
    create_table documents "$fields"



exit 0


echo "--- insert dossier"
# dfx canister call backend execute 'insert into dossier (id, autore, nomeopera, ora_inserimento, username, icon_uri) values (1, "Elisabetta Villa", "Madalina Ghenea", "2024-03-18", "techne_seller", "https://techne-test.mostapps.it/ipfs/Qmc57JrLZiFybNG8T3Vq7x2AumLnXkz73Sq7ZL1EanFZLc" );'

# Query:
# dfx canister call backend dossier_query 'record {limit=10; offset=0; autore= "Elisabetta Villa"}'
# dfx canister call backend  query "select max(id) from dossier"
# insert via JSON
# dfx canister call backend  dossier_insert '{ "autore": "Pinco Pallino", "nomeopera": "pippo paappo", "ora_inserimento": "2024-03-25", "username": "pluto", "icon_uri":"https://techne-test.mostapps.it/ipfs/QmeAV99r5LckFBAJxu5FUwhpMWjQ9XCSRd5cSC2w3k5vWJ" }'
dfx canister call $network backend execute 'insert into rbac (id, principal, friendly_name, view_opera_ok, add_opera_ok , dna_mark_ok, add_dna_ok) values (1, "uybjb-x2bz4-k5mwy-4h4fk-7ca6d-evlpb-trrht-7wzsu-bkjxr-53jik-jqe", "Roberto Pirrone 1", true,true, true, true)'
