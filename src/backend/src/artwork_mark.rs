extern crate ic_cdk_macros;
extern crate serde;
use ic_cdk::{query, update};
use candid::CandidType;
use serde::{Deserialize, Serialize};

use crate::my_utils::*;

#[derive(Debug, Serialize, Deserialize)]
struct Mark {
    dull_code: String, 
    position: String, 
}

#[derive(Debug, Serialize, Deserialize)]
struct ArtworkMark {
    id: Option<u64>,
    uuid: String,
    dossier_id: String,
    inserted_by: Option<String>,
    ora_inserimento: String,
    mark_dull_code: String, 
    mark_position: String, 
    note: String
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
pub struct ArtworkMarkQueryParams {
    limit: usize,
    offset: usize,
}

#[derive(Serialize, Deserialize)]
struct ArtworkMarkReturnStruct {
    success: bool,
    artwork_marks: Vec<ArtworkMark>
    }

#[query]
#[no_mangle]
pub fn artwork_mark_query(params: ArtworkMarkQueryParams) -> JsonResult {
    let artwork_mark_sql = "select * from artwork_mark limit ?1 offset ?2";
    ic_cdk::println!("Query: {artwork_mark_sql} ");
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare(&artwork_mark_sql) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };
    let artwork_mark_iter = match stmt.query_map((params.limit, params.offset), |row| {
        Ok(
            ArtworkMark {
            id: row.get(0).unwrap(),
            uuid: row.get(1).unwrap(),
            dossier_id: row.get(2).unwrap(),
            inserted_by: row.get(3).unwrap(),
            ora_inserimento: row.get(4).unwrap(),
            mark_dull_code: row.get(5).unwrap(),
            mark_position: row.get(6).unwrap(),
            note: row.get(7).unwrap()
        })
    }) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };
    let mut artwork_marks = Vec::new();
    for artwork_mark in artwork_mark_iter {
        artwork_marks.push(artwork_mark.unwrap());
    }
    let rs = ArtworkMarkReturnStruct {
        success: true,
        artwork_marks: artwork_marks
    };
    let res = serde_json::to_string(&rs).unwrap();
    Ok(res)
}

#[update]
#[no_mangle]
pub fn artwork_mark_insert(jv: String) -> ExecResult {
    ic_cdk::println!("artwork_mark_insert input: {jv} ");
    let d: ArtworkMark = serde_json::from_str(&jv).unwrap();
    let conn = ic_sqlite::CONN.lock().unwrap();
    let caller = ic_cdk::caller().to_string();
    ic_cdk::println!("caller : {caller} ");

    let sql = format!("insert into artwork_mark \
        (uuid, dossier_id, inserted_by, ora_inserimento, mark_dull_code, mark_position, note) 
        values ( '{}', '{}', '{}', '{}', '{}', '{}', '{}' )",
        d.uuid, d.dossier_id, caller, d.ora_inserimento, d.mark_dull_code , d.mark_position , d.note
        );
    return match conn.execute(
        &sql,
        []
    ) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(MyError::CanisterError {message: format!("{:?}", err) })
    }
}

