unset DFX_NETWORK

bash make_did.sh
dfx build frontend
dfx build backend
dfx identity use default
dfx canister install frontend --mode upgrade
dfx canister install backend --mode upgrade
exit 0

dfx build backend
dfx build frontend
dfx identity use NuovaIdentitaRobi
dfx deploy --ic
cd src/backend
bash dbOps.sh
