extern crate ic_cdk_macros;
extern crate serde;
use ic_cdk::{query, update};
use candid::CandidType;
use serde::{Deserialize, Serialize};

use crate::my_utils::*;
use crate::dossier::{Dossier, dossier_struct_query};

#[derive(Debug, Serialize, Deserialize)]
pub struct Documento {
    id: Option<u64>,
    uuid: String,
    autore: String,
    ora_inserimento: String,
    title: String,
    versione: u64,
    dossieropera_id: u64,
    filename: String,
    filesize: u64,
    mimetype: String,
    image_uri: String,
    inserted_by: Option<String>,
    tipo_documento: String
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
pub struct QueryDocumentsParams {
    dossieropera_id: String
}

#[derive(Serialize, Deserialize)]
pub struct ReturnDocumentsStruct {
    success: bool,
    dossier_info: Dossier, 
    rows: Vec<Documento>
    }

#[query]
pub fn documenti_query(params: QueryDocumentsParams) -> JsonResult {
    // devo anche restituire i dati del dossier
    let dossier_infos: Vec<Dossier> ;
    let id = params.dossieropera_id.clone();
    let dossier_sql = format!("select * from dossier where id = {:?}",id);
    // let dossier_sql = "select * from dossier";
    ic_cdk::println!("Query: {dossier_sql} ");

    dossier_infos = dossier_struct_query(dossier_sql.to_string());
    let dossier_info = dossier_infos[0].clone();
    ic_cdk::println!("dossier_info: {:?}", dossier_infos[0]);

    // ora i  documenti
    let documenti_sql = "select * from documents where dossieropera_id = ?1";
    // let dossier_sql = "select * from dossier";
    ic_cdk::println!("Query: {documenti_sql} ");
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare(&documenti_sql) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };
    // i parametri della query_map devono essere in una tuple, anche se c'è un solo paraemtro, in ?: -> https://docs.rs/rusqlite/latest/rusqlite/trait.Params.html#positional-parameters

    let documenti_iter = match stmt.query_map((params.dossieropera_id,), |row| {
        Ok(
            Documento {
            id: row.get(0).unwrap(),
            uuid: row.get(1).unwrap(),
            autore: row.get(2).unwrap(),
            ora_inserimento: row.get(3).unwrap(),
            title: row.get(4).unwrap(),
            versione: row.get(5).unwrap(),
            dossieropera_id: row.get(6).unwrap(),
            filename: row.get(7).unwrap(),
            filesize: row.get(8).unwrap(),
            mimetype: row.get(9).unwrap(),
            image_uri: row.get(10).unwrap(),
            inserted_by: row.get(10).unwrap(),
            tipo_documento: row.get(11).unwrap()
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
pub fn document_insert(jv: String) -> ExecResult {
    ic_cdk::println!("document_insert input: {jv} ");
    let d: Documento = serde_json::from_str(&jv).unwrap();
    let conn = ic_sqlite::CONN.lock().unwrap();
    let image_uri = d.image_uri.to_string();
    ic_cdk::println!("image_uri: {:?}", image_uri);
    let caller = ic_cdk::caller().to_string();
    // let wrap = sql_ret.unwrap();

    let sql = format!("insert into documents 
        (uuid, autore, ora_inserimento, title, versione, dossieropera_id, filename, filesize, mimetype, image_uri, inserted_by, tipo_documento) 
        values ('{}', '{}', '{}', '{}', {}, {}, '{}', {}, '{}', '{}', '{}', '{}' )", 
        d.uuid, d.autore, d.ora_inserimento, d.title, d.versione, d.dossieropera_id, d.filename, d.filesize, d.mimetype, image_uri, caller, d.tipo_documento );
    ic_cdk::println!("document_insert sql: {:?}", sql);

    return match conn.execute(
        &sql,
        []
    ) {
        Ok(e) => Ok(format!("document_insert OK: {:?}", e)),
        Err(err) => Err(MyError::CanisterError {message: format!("document_insert KO: {:?}", err) })
    }
}
