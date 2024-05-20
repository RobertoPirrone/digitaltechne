unset DFX_NETWORK

dfx canister create uploads
dfx canister create internet_identity
dfx canister create frontend
dfx canister create backend

dfx build backend
bash make_did.sh
dfx build frontend
dfx identity use default
dfx canister install uploads 
dfx canister install internet_identity 
dfx canister install frontend 
dfx canister install backend 
cd src/backend
bash dbOps.sh

exit 0
