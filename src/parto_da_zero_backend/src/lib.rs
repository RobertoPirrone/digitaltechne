//#[macro_use]
extern crate ic_cdk_macros;
//#[macro_use]
extern crate serde;

use ic_cdk::{query, update};
use ic_cdk::api::call::RejectionCode;

use candid::CandidType;
use rusqlite::types::Type;

use serde::{Deserialize, Serialize};

use std::cell::RefCell;

thread_local! {
    static COUNTER : RefCell<u32> = RefCell::new(0);
}


#[query]
fn instruction_counter() -> u64 {
    ic_cdk::api::instruction_counter()
}

#[update]
fn execute(sql: String) -> ExecResult {
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

#[derive(Debug, CandidType, Deserialize)]
enum MyError {
    InvalidCanister,
    CanisterError { message: String },
}

type ExecResult<T = String, E = MyError> = std::result::Result<T, E>;
type JsonResult<T = String, E = MyError> = std::result::Result<T, E>;

type QueryResult<T = Vec<Vec<String>>, E = MyError> = std::result::Result<T, E>;

impl From<(RejectionCode, String)> for MyError {
    fn from((code, message): (RejectionCode, String)) -> Self {
        match code {
            RejectionCode::CanisterError => Self::CanisterError { message },
            _ => Self::InvalidCanister,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct Dossier {
    id: Option<u64>,
    autore: String,
    nomeopera: String,
    ora_inserimento: String,
    username: String,
    icon_uri: String
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct QueryParams {
    autore: String,
    limit: usize,
    offset: usize,
}

#[derive(Serialize, Deserialize)]
struct ReturnStruct {
    success: bool,
    ret_owner: Vec<Dossier>
    }


#[derive(Debug, Serialize, Deserialize)]
struct Documento {
    id: Option<u64>,
    autore: String,
    nomeopera: String,
    ora_inserimento: String,
    title: String,
    versione: u64,
    dossieropera_id: u64,
    filename: String,
    filesize: u64,
    mimetype: String,
    image_uri: String
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct QueryDocumentsParams {
    dossieropera_id: String
}

#[derive(Serialize, Deserialize)]
struct ReturnDocumentsStruct {
    success: bool,
    dossier_info: Dossier, 
    rows: Vec<Documento>
    }


#[query]
fn dossier_query(params: QueryParams) -> JsonResult {
    let dossier_sql = "select * from dossier where autore = ?1 limit ?2 offset ?3";
    // let dossier_sql = "select * from dossier";
    ic_cdk::println!("Query: {dossier_sql} ");
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare(&dossier_sql) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };
    let dossier_iter = match stmt.query_map((params.autore, params.limit, params.offset), |row| {
        Ok(
            Dossier {
            id: row.get(0).unwrap(),
            autore: row.get(1).unwrap(),
            nomeopera: row.get(2).unwrap(),
            ora_inserimento: row.get(3).unwrap(),
            username: row.get(4).unwrap(),
            icon_uri: row.get(5).unwrap()
        })
    }) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };
    let mut dossiers = Vec::new();
    for dossier in dossier_iter {
        dossiers.push(dossier.unwrap());
    }
    let rs = ReturnStruct {
        success: true,
        ret_owner: dossiers
    };
    let res = serde_json::to_string(&rs).unwrap();
    Ok(res)
}

#[update]
fn dossier_insert(jv: String) -> ExecResult {
    ic_cdk::println!("dossier_insert input: {jv} ");
    let d: Dossier = serde_json::from_str(&jv).unwrap();
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare(&format!("select max(id) from {:?}", "dossier")) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };
    let mut iter = match stmt.query_map([], |row| {
        let count: u64 = row.get(0).unwrap();
        Ok(count)
    }) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("count: {:?}", err) })
    };
    let count = iter.next().unwrap().unwrap();
    ic_cdk::println!("count: {:?}", count);
    // let wrap = sql_ret.unwrap();

    let uuid = count + 1;
    let sql = format!("insert into dossier (id, autore, nomeopera, ora_inserimento, username, icon_uri) values ({}, '{}', '{}', '{}', '{}', '{}')", uuid, d.autore, d.nomeopera, d.ora_inserimento, d.username, d.icon_uri );
    return match conn.execute(
        &sql,
        []
    ) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(MyError::CanisterError {message: format!("{:?}", err) })
    }
}


#[query]
fn whoami() -> String {
    let caller = ic_cdk::caller();
    caller.to_string()
}

#[query]
fn get_counter() -> u32 {
    COUNTER.with(|counter| *counter.borrow())
}

#[update]
fn inc_counter() -> u32 {
    COUNTER.with(|counter| {
        *counter.borrow_mut() += 1;
        *counter.borrow()
    })
}

#[query]
fn documenti_query(params: QueryDocumentsParams) -> JsonResult {
    // devo anche restituire i dati del dossier
    let id = params.dossieropera_id.clone();
    let dossier_sql = "select * from dossier where id = ?1";
    // let dossier_sql = "select * from dossier";
    ic_cdk::println!("Query: {dossier_sql} ");
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare(&dossier_sql) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };
    let mut dossier_iter = match stmt.query_map((id,), |row| {
        Ok(
            Dossier {
            id: row.get(0).unwrap(),
            autore: row.get(1).unwrap(),
            nomeopera: row.get(2).unwrap(),
            ora_inserimento: row.get(3).unwrap(),
            username: row.get(4).unwrap(),
            icon_uri: row.get(5).unwrap()
        })
    }) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };

    let dossier_info: Dossier = dossier_iter.next().unwrap().unwrap();
    ic_cdk::println!("dossier_info: {:?}", dossier_info);

    // ora i  documenti
    let documenti_sql = "select * from documents where dossieropera_id = ?1";
    // let dossier_sql = "select * from dossier";
    ic_cdk::println!("Query: {documenti_sql} ");
    let mut stmt = match conn.prepare(&documenti_sql) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };
    // i parametri della query_map devono essere in una tuple, anche se c'è un solo paraemtro, in ?: -> https://docs.rs/rusqlite/latest/rusqlite/trait.Params.html#positional-parameters

    let documenti_iter = match stmt.query_map((params.dossieropera_id,), |row| {
        Ok(
            Documento {
            id: row.get(0).unwrap(),
            autore: row.get(1).unwrap(),
            nomeopera: row.get(2).unwrap(),
            ora_inserimento: row.get(3).unwrap(),
            title: row.get(4).unwrap(),
            versione: row.get(5).unwrap(),
            dossieropera_id: row.get(6).unwrap(),
            filename: row.get(7).unwrap(),
            filesize: row.get(8).unwrap(),
            mimetype: row.get(9).unwrap(),
            image_uri: row.get(10).unwrap()
        })
    }) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };
    let mut documenti = Vec::new();
    for documento in documenti_iter {
        documenti.push(documento.unwrap());
    }
    let rs = ReturnDocumentsStruct {
        success: true,
        dossier_info: dossier_info,
        rows: documenti
    };
    let res = serde_json::to_string(&rs).unwrap();
    Ok(res)
}

#[update]
fn document_insert(jv: String) -> ExecResult {
    ic_cdk::println!("document_insert input: {jv} ");
    let d: Documento = serde_json::from_str(&jv).unwrap();
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare(&format!("select max(id) from {:?}", "documents")) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };
    let mut iter = match stmt.query_map([], |row| {
        let count: u64 = row.get(0).unwrap();
        Ok(count)
    }) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("count: {:?}", err) })
    };
    let count = iter.next().unwrap().unwrap();
    ic_cdk::println!("count: {:?}", count);
    // let wrap = sql_ret.unwrap();

    let uuid = count + 1;
    let sql = format!("insert into documents (id, autore, nomeopera, ora_inserimento, title, versione, dossieropera_id, filename, filesize, mimetype, image_uri) values ({}, '{}', '{}', '{}', '{}', {}, '{}, '{}', {}, '{}, '{}')", uuid, d.autore, d.nomeopera, d.ora_inserimento, d.title, d.versione, d.dossieropera_id, d.filename, d.filesize, d.mimetype, d.image_uri );

    return match conn.execute(
        &sql,
        []
    ) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(MyError::CanisterError {message: format!("{:?}", err) })
    }
}

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}


ic_cdk::export_candid!();

