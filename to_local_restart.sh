# npm install -D typescript (per tsc)
# dfx start --background --clean

unset DFX_NETWORK

dfx canister create internet_identity
dfx build internet_identity 
dfx canister install internet_identity 

dfx canister create uploads
dfx build uploads 
dfx canister install uploads 

dfx canister create frontend
dfx canister create backend

dfx build backend
bash make_did.sh
dfx build frontend

exit 0


dfx identity use default
dfx canister install frontend 
dfx canister install backend 
cd src/backend
bash dbOps.sh

exit 0
