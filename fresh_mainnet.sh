dfx identity use MainnetRobi
export network="--ic"
export DFX_NETWORK=ic


dfx canister create $network uploads --with-cycles 200000000000
dfx build $network uploads 
dfx canister install $network uploads 

dfx generate

dfx canister create $network backend --with-cycles 200000000000
dfx build $network backend
bash make_did.sh
dfx canister install $network backend 

dfx canister create $network frontend --with-cycles 200000000000
dfx build $network frontend
dfx canister install $network frontend 
