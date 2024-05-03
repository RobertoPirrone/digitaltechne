extern crate ic_cdk_macros;
extern crate serde;
use ic_cdk::{export_candid, query, update};
use rusqlite::types::Type;

pub mod artwork_mark;
pub mod cartridge;
pub mod documents;
pub mod dossier;
pub mod my_utils;
pub use crate::artwork_mark::{ArtworkMarkQueryParams, artwork_mark_insert, artwork_mark_query};
pub use crate::cartridge::{CartridgeQueryParams, CartridgeUseParams, cartridge_insert, cartridge_query, cartridge_use_insert};
pub use crate::documents::{Documento, QueryDocumentsParams, document_insert, documenti_query};
pub use crate::dossier::{Dossier, QueryParams, dossier_insert, dossier_query, dossier_struct_query, dossier_pulldowns};
use crate::my_utils::*;

#[update]
fn execute(sql: String) -> ExecResult {
    ic_cdk::println!("Execute {sql}");
    let conn = ic_sqlite::CONN.lock().unwrap();
    return match conn.execute(
        &sql,
        []
    ) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(MyError::CanisterError {message: format!("{:?}", err) })
    }
}

#[query]
fn query(sql: String) -> QueryResult {
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = conn.prepare(&sql).unwrap();
    let cnt = stmt.column_count();
    ic_cdk::println!("Query returns {cnt} rows");
    let mut rows = stmt.query([]).unwrap();
    let mut res: Vec<Vec<String>> = Vec::new();
    loop {
        match rows.next() {
            Ok(row) => {
                match row {
                    Some(row) => {
                        let mut vec: Vec<String> = Vec::new();
                        for idx in 0..cnt {
                            let v = row.get_ref_unwrap(idx);
                            match v.data_type() {
                                Type::Null => {  vec.push(String::from("")) }
                                Type::Integer => { vec.push(v.as_i64().unwrap().to_string()) }
                                Type::Real => { vec.push(v.as_f64().unwrap().to_string()) }
                                Type::Text => { vec.push(v.as_str().unwrap().parse().unwrap()) }
                                Type::Blob => { vec.push(hex::encode(v.as_blob().unwrap())) }
                            }
                        }
                        res.push(vec)
                    },
                    None => break
                }
            },
            Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
        }
    }
    Ok(res)
}

#[query]
fn whoami() -> String {
    let caller = ic_cdk::caller();
    caller.to_string()
}

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

export_candid!();

