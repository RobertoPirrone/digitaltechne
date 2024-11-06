extern crate ic_cdk_macros;
extern crate serde;
use ic_cdk::{query, update};
use rusqlite::types::Type;

use crate::my_utils::*;

#[update]
pub fn execute(sql: String) -> ExecResult {
    ic_cdk::println!("Execute {sql}");
    let conn = ic_sqlite::CONN.lock().unwrap();
    return match conn.execute(&sql, []) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(MyError::CanisterError {
            message: format!("{:?}", err),
        }),
    };
}

#[query]
pub fn query(sql: String) -> QueryResult {
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = conn.prepare(&sql).unwrap();
    let cnt = stmt.column_count();
    ic_cdk::println!("Query returns {cnt} rows");
    let mut rows = stmt.query([]).unwrap();
    let mut res: Vec<Vec<String>> = Vec::new();
    loop {
        match rows.next() {
            Ok(row) => match row {
                Some(row) => {
                    let mut vec: Vec<String> = Vec::new();
                    for idx in 0..cnt {
                        let v = row.get_ref_unwrap(idx);
                        match v.data_type() {
                            Type::Null => vec.push(String::from("")),
                            Type::Integer => vec.push(v.as_i64().unwrap().to_string()),
                            Type::Real => vec.push(v.as_f64().unwrap().to_string()),
                            Type::Text => vec.push(v.as_str().unwrap().parse().unwrap()),
                            Type::Blob => vec.push(hex::encode(v.as_blob().unwrap())),
                        }
                    }
                    res.push(vec)
                }
                None => break,
            },
            Err(err) => {
                return Err(MyError::CanisterError {
                    message: format!("{:?}", err),
                })
            }
        }
    }
    Ok(res)
}
