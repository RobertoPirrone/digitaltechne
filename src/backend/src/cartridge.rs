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
    insert_time: String,
    purchase_time: Option<String>,
    note: String
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
pub struct CartridgeQueryParams {
    uuid: String,
}

#[derive(Serialize, Deserialize)]
struct CartridgeReturnStruct {
    success: bool,
    cartridges: Vec<Cartridge>
    }

#[query]
#[no_mangle]
pub fn cartridge_query(params: CartridgeQueryParams) -> JsonResult {
    let cartridge_sql = "select * from cartridge where uuid = ?1";
    //let dossier_sql = "select * from dossier where autore = ?3 limit ?1 offset ?2";
    ic_cdk::println!("Query: {cartridge_sql} ");
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare(&cartridge_sql) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };
    let cartridge_iter = match stmt.query_map((params.uuid,), |row| {
        Ok(
            Cartridge {
            id: row.get(0).unwrap(),
            uuid: row.get(1).unwrap(),
            dna_text: row.get(2).unwrap(),
            dna_file_asset: row.get(3).unwrap(),
            inserted_by: row.get(4).unwrap(),
            lab_name: row.get(5).unwrap(),
            insert_time: row.get(6).unwrap(),
            purchase_time: row.get(6).unwrap(),
            note: row.get(8).unwrap()
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
        (uuid, dna_text, dna_file_asset, inserted_by, lab_name, insert_time, note) 
        values ('{}', '{}', '{}', '{}', '{}', '{}', '{}' )",
        d.uuid, d.dna_text, d.dna_file_asset, caller, d.lab_name , d.insert_time, d.note
        );
    return match conn.execute(
        &sql,
        []
    ) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(MyError::CanisterError {message: format!("{:?}", err) })
    }
}

// CartridgeUse 

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
pub struct CartridgeUseParams {
    count: String,
    uuid: String,
    purchase_time: String,
}
#[derive(Debug, Serialize, Deserialize)]
struct CartridgeUse {
    id: Option<u64>,
    uuid: String, 
    cartridge_uuid: String, 
    purchase_time: String,
    owned_by: String,
    usage_time: Option<String>,
    dossier_id: Option<String>
}

// il caller acquista una cartuccia (in futuro n)
#[update]
#[no_mangle]
pub fn cartridge_use_insert(params: CartridgeUseParams) -> ExecResult {
    let conn = ic_sqlite::CONN.lock().unwrap();
    let caller = ic_cdk::caller().to_string();
    ic_cdk::println!("caller : {caller} ");

    let sql_q = format!("select uuid from  cartridge where purchase_time is null limit 1");
    let mut stmt = conn.prepare(&sql_q).unwrap();
    let mut rows = stmt.query([]).unwrap();
    let cartridge_uuid ;
        match rows.next() {
            Ok(row) => {
                match row {
                    Some(row) => {
                        cartridge_uuid =  row.get_ref_unwrap(0).as_str().unwrap();
                        ic_cdk::println!("some : {cartridge_uuid} ");
                    },
                    None => return Err(MyError::CanisterError {message: format!("{:?}", "No matching cartridge") })
                }
            },
            Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
        };

    ic_cdk::println!("cartridge_uuid : {cartridge_uuid:?} ");

    let sql_u = format!("update cartridge set purchase_time = '{}' where uuid = '{}' ", params.purchase_time, cartridge_uuid);
    let _unused  =  match conn.execute(
        &sql_u,
        []
    ) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(MyError::CanisterError {message: format!("{:?}", err) })
    };

    let sql = format!("insert into cartridge_use \
        (uuid, cartridge_uuid, purchase_time, owned_by) 
        values ('{}', '{}', '{}', '{}')",
        params.uuid, cartridge_uuid, params.purchase_time, caller
        );
    return match conn.execute(
        &sql,
        []
    ) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(MyError::CanisterError {message: format!("cartridge_use_insert {:?}", err) })
    }
}

#[update]
#[no_mangle]
pub fn cartridge_use_update(jv: String) -> ExecResult {
    ic_cdk::println!("cartridge_use_update input: {jv} ");
    let d: CartridgeUse = serde_json::from_str(&jv).unwrap();
    let conn = ic_sqlite::CONN.lock().unwrap();
    let caller = ic_cdk::caller().to_string();
    let dossier_id = format!("{:?}",d.dossier_id);
    let usage_time = format!("{:?}",d.usage_time);
    ic_cdk::println!("caller : {caller} ");

    let sql = format!("update cartridge_use \
        (usage_time, dossier_id) 
        values ('{}', '{}')
        where uuid = '{}'
        ",
        usage_time, dossier_id, d.uuid
        );
    return match conn.execute(
        &sql,
        []
    ) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(MyError::CanisterError {message: format!("cartridge_use_update {:?}", err) })
    }
}

