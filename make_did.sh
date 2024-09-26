#!/usr/bin/env bash
# serve per generare il .did di backend. E basta

function generate_did() {
  local canister=$1

  cargo build --manifest-path="./Cargo.toml" \
      --target wasm32-unknown-unknown \
      --release --package "$canister"

  candid-extractor "target/wasm32-unknown-unknown/release/$canister.wasm" > "src/$canister//$canister.did"
}

# The list of canisters of your project
CANISTERS=backend

for canister in $(echo $CANISTERS | sed "s/,/ /g")
do
    generate_did "$canister"
done

# dfx generate
