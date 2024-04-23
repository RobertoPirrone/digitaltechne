extern crate ic_cdk_macros;
extern crate serde;
use ic_cdk::{query, update};
use candid::CandidType;
use serde::{Deserialize, Serialize};

use crate::my_utils::*;

#[derive(Debug, Serialize, Deserialize)]
struct Cartridge {
    id: Option<u64>,
    uuid: String, 
    dna_text: String,
    dna_file_asset: String,
    inserted_by: Option<String>,
    lab_name: String,
    ora_inserimento: String,
    note: String
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
pub struct CartridgeQueryParams {
    limit: usize,
    offset: usize,
}

#[derive(Serialize, Deserialize)]
struct CartridgeReturnStruct {
    success: bool,
    cartridges: Vec<Cartridge>
    }

#[query]
#[no_mangle]
pub fn cartridge_query(params: CartridgeQueryParams) -> JsonResult {
    let cartridge_sql = "select * from cartridge limit ?1 offset ?2";
    //let dossier_sql = "select * from dossier where autore = ?3 limit ?1 offset ?2";
    ic_cdk::println!("Query: {cartridge_sql} ");
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare(&cartridge_sql) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };
    let cartridge_iter = match stmt.query_map((params.limit, params.offset), |row| {
        Ok(
            Cartridge {
            id: row.get(0).unwrap(),
            uuid: row.get(1).unwrap(),
            dna_text: row.get(2).unwrap(),
            dna_file_asset: row.get(3).unwrap(),
            inserted_by: row.get(4).unwrap(),
            lab_name: row.get(5).unwrap(),
            ora_inserimento: row.get(6).unwrap(),
            note: row.get(7).unwrap()
        })
    }) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };
    let mut cartridges = Vec::new();
    for cartridge in cartridge_iter {
        cartridges.push(cartridge.unwrap());
    }
    let rs = CartridgeReturnStruct {
        success: true,
        cartridges: cartridges
    };
    let res = serde_json::to_string(&rs).unwrap();
    Ok(res)
}

#[update]
#[no_mangle]
pub fn cartridge_insert(jv: String) -> ExecResult {
    ic_cdk::println!("cartridge_insert input: {jv} ");
    let d: Cartridge = serde_json::from_str(&jv).unwrap();
    let conn = ic_sqlite::CONN.lock().unwrap();
    let caller = ic_cdk::caller().to_string();
    ic_cdk::println!("caller : {caller} ");

    let sql = format!("insert into cartridge \
        (uuid, dna_text, dna_file_asset, inserted_by, lab_name, ora_inserimento, note) 
        values ('{}', '{}', '{}', '{}', '{}', '{}', '{}' )",
        d.uuid, d.dna_text, d.dna_file_asset, caller, d.lab_name , d.ora_inserimento, d.note
        );
    return match conn.execute(
        &sql,
        []
    ) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(MyError::CanisterError {message: format!("{:?}", err) })
    }
}

