#!/bin/bash
# Initialize DB and uploads canister for the first user
# Requires Canisters already deployed 
Usage() {
    echo "Usage: $0 --local|--ic"
    exit 1
}

# 0) local or remote?
if [ $# -eq 1 ] ; then
    if [  x$1 = "x--ic" ] ; then
        network="--ic"
    elif [  x$1 = "x--local" ] ; then
        network=""
    else
        Usage
    fi
else
    Usage
fi

# 1) initialize DB, if needed:
dfx canister call backend  query --output json "select * from rbac"  > /dev/null
status=$?
if [ $status -ne 0 ] ; then
    echo Creating DB
    (cd src/backend; bash grambergDbOps.sh $network)
    echo ""
    echo ""
    echo ""
    echo PLEASE connect to the Front End and Login
    exit 0
else
    echo DB already OK
fi

# 2a) on a browser, go to the main page (localhost:3000 or grmberg.digitaltechne.ch). Verify:
cnt=$(dfx canister call backend $network query --output json "select count(*) from rbac"  | jq ".Ok"[0][0])
if [ $cnt = '"0"' ] ; then
    echo missing first user
    echo PLEASE connect to the Front End and Login
    exit 0
fi
# 2b) Only after first login (first rbac row is set):
principal=$(dfx canister call backend $network query --output json "select principal from rbac"  | jq ".Ok"[0][0])

# 3) enable file uploads for the user
auth=$(printf "dfx canister call uploads  authorize '(principal %s )'" $principal)
echo $auth
eval "$auth"

# 4) give superpowers to the user
remove_dblquotes=$(echo $principal | tr -d \")
echo $remove_dblquotes
rbac_grants=$(printf "dfx canister call backend  $network execute \"update rbac set view_opera_ok = true, add_opera_ok = true, add_dna_ok = true, dna_mark_ok = true, admin_ok = true where principal ='%s'\"" $remove_dblquotes)
echo $rbac_grants
eval "$rbac_grants"
