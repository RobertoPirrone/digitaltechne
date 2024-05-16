export DFX_NETWORK=ic
bash make_did.sh
dfx build --ic frontend
dfx build --ic backend
dfx identity use NuovaIdentitaRobi
dfx canister install --ic frontend --mode upgrade
dfx canister install --ic backend --mode upgrade
exit 0

dfx build backend
dfx build frontend
dfx identity use NuovaIdentitaRobi
dfx deploy --ic
cd src/backend
bash dbOps.sh
