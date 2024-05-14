extern crate ic_cdk_macros;
extern crate serde;
use ic_cdk::{query, update};
use candid::CandidType;
use serde::{Deserialize, Serialize};

use crate::my_utils::*;

#[derive(CandidType, Debug, Serialize, Deserialize, Clone)]
pub struct Dossier {
    id: Option<u64>,
    uuid: String,
    autore: String,
    nomeopera: String,
    ora_inserimento: String,
    inserted_by: Option<String>,
    luogoopera: String,
    private: bool,
    icon_uri: String,
    tipoopera: String,
    has_artwork_mark: Option<bool>,
    friendly_name: Option<String>
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
pub struct QueryParams {
    limit: usize,
    offset: usize,
}

#[derive(Serialize, Deserialize)]
pub struct DossierInfoReturnStruct {
    success: bool,
    autori: Vec<String>,
    luogooperas: Vec<String>,
    tipooperas: Vec<String>
    }

#[derive(Serialize, Deserialize)]
pub struct DossierReturnStruct {
    success: bool,
    ret_public: Vec<Dossier>,
    ret_owner: Vec<Dossier>
    }

struct DistinctResult {
    ele: String
}

#[query]
pub fn dossier_pulldowns() -> JsonResult {
    // autore
    let mut dossier_sql = "select distinct autore from dossier";
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare(&dossier_sql) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };
    let iter = match stmt.query_map([], |row| {
        Ok(
            DistinctResult {
                ele: row.get(0).unwrap()
            }
        )
    }) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };
    let mut autori = Vec::new();
    for ele in iter {
        match ele {
            Ok(e) => autori.push(e.ele),
            Err(e) => eprintln!("Error: {e:?}"),
        }

    }

    // luogoopera
    dossier_sql = "select distinct luogoopera from dossier";
    let mut stmt = match conn.prepare(&dossier_sql) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };
    let iter = match stmt.query_map([], |row| {
        Ok(
            DistinctResult {
                ele: row.get(0).unwrap()
            }
        )
    }) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };
    let mut luogooperas = Vec::new();
    for ele in iter {
        match ele {
            Ok(e) => luogooperas.push(e.ele),
            Err(e) => eprintln!("Error: {e:?}"),
        }

    }

    // tipoopera
    dossier_sql = "select distinct code from tipoopera_code";
    let mut stmt = match conn.prepare(&dossier_sql) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };
    let iter = match stmt.query_map([], |row| {
        Ok(
            DistinctResult {
                ele: row.get(0).unwrap()
            }
        )
    }) {
        Ok(e) => e,
        Err(err) => return Err(MyError::CanisterError {message: format!("{:?}", err) })
    };
    let mut tipooperas = Vec::new();
    for ele in iter {
        match ele {
            Ok(e) => tipooperas.push(e.ele),
            Err(e) => eprintln!("Error: {e:?}"),
        }

    }

    let rs = DossierInfoReturnStruct {
        success: true,
        autori: autori,
        luogooperas: luogooperas,
        tipooperas: tipooperas
    };
    let res = serde_json::to_string(&rs).unwrap();
    Ok(res)
}

// query generica a dossier. 
#[query]
pub fn dossier_struct_query(sql: String ) -> Vec<Dossier> {
    ic_cdk::println!("dossier_struct_query: {sql} ");
    let mut dossiers = Vec::new();
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = conn.prepare(&sql).unwrap();
    let mut rows = stmt.query([]).unwrap();
    loop {
        match rows.next()   {
            Ok(row) => {
                match row {
                    Some(row) => {
                        let res_row =  Dossier {
                                id: row.get(0).unwrap(),
                                uuid: row.get(1).unwrap(),
                                autore: row.get(2).unwrap(),
                                nomeopera: row.get(3).unwrap(),
                                ora_inserimento: row.get(4).unwrap(),
                                inserted_by: row.get(5).unwrap(),
                                luogoopera: row.get(6).unwrap(),
                                private: row.get(7).unwrap(),
                                icon_uri: row.get(8).unwrap(),
                                tipoopera: row.get(9).unwrap(),
                                has_artwork_mark: row.get(10).unwrap(), 
                                friendly_name: row.get(11).unwrap()
                            };

                        dossiers.push(res_row)
                    },
                    None => break
                }
            },
            Err(_err) => return dossiers
            }
    }

    return dossiers;
}

#[query]
pub fn dossier_query(params: QueryParams) -> JsonResult {
    let caller = ic_cdk::caller().to_string();
    let checked_caller: Rbac = check_caller()?;
    ic_cdk::println!("checked_caller : {:?} ", checked_caller);
    if ! checked_caller.view_opera_ok {
        return Err(MyError::CanisterError {message: format!("{:?}", "dossier_query: user not allowed") })
    }
    // let owner_sql = format!("select * from dossier where inserted_by = '{:}' and private = true limit {:?} offset {:?}", caller, params.limit, params.offset );
    // let public_sql = format!("select * from dossier where inserted_by = '{:}' and private = false limit {:?} offset {:?}", caller, params.limit, params.offset );
    let owner_sql = format!("select dossier.*, friendly_name from dossier left outer join rbac where inserted_by = principal and inserted_by = '{:}' and private = true limit {:?} offset {:?}", caller, params.limit, params.offset );
    let public_sql = format!("select dossier.*, friendly_name from dossier left outer join rbac where inserted_by = principal and private = false limit {:?} offset {:?}", params.limit, params.offset );
    ic_cdk::println!("Query: {owner_sql} ");

    let owner_dossier_infos = dossier_struct_query(owner_sql.to_string());
    let public_dossier_infos = dossier_struct_query(public_sql.to_string());

    let rs = DossierReturnStruct {
        success: true,
        ret_public: public_dossier_infos,
        ret_owner: owner_dossier_infos
    };
    let res = serde_json::to_string(&rs).unwrap();
    Ok(res)
}

#[update]
pub fn dossier_insert(jv: String) -> ExecResult {
    ic_cdk::println!("dossier_insert input: {jv} ");
    let d: Dossier = serde_json::from_str(&jv).unwrap();
    let caller = ic_cdk::caller().to_string();
    let conn = ic_sqlite::CONN.lock().unwrap();

    let sql = format!("insert into dossier \
        (uuid, autore, nomeopera, ora_inserimento, inserted_by, icon_uri, luogoopera, private, tipoopera) 
        values ('{}', '{}', '{}', '{}', '{}', '{}', '{}', {}, '{}' )",
        d.uuid, d.autore, d.nomeopera, d.ora_inserimento, caller, d.icon_uri , d.luogoopera, d.private, d.tipoopera
        );
    return match conn.execute(
        &sql,
        []
    ) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(MyError::CanisterError {message: format!("{:?}", err) })
    }
}

