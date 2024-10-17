//! RBAC (Role based access control) utils and return types
extern crate ic_cdk_macros;
extern crate serde;
use candid::{CandidType, Principal};
use ic_cdk::{query, update};
use serde::Deserialize;

use crate::my_utils::*;

#[derive(CandidType, Debug, Deserialize)]
pub struct Rbac {
    id: u64,
    principal: String,
    pub friendly_name: Option<String>,
    pub admin_ok: bool,
    pub view_opera_ok: bool,
    pub add_opera_ok: bool,
    pub associate_dna_ok: bool,
    pub add_dna_ok: bool,
}

/// Returns the [`Rbac`] struct associated with the authenticated caller
#[query]
pub fn check_caller() -> CheckResult {
    let caller = ic_cdk::caller();
    // The anonymous principal is not allowed to interact with canister.
    ic_cdk::println!("caller: {caller}, anon {:?} ", Principal::anonymous().to_string());
    let rbac_sql = format!("select id, principal, friendly_name, view_opera_ok, add_opera_ok, associate_dna_ok, add_dna_ok, admin_ok from rbac where principal = {:?}", caller.to_string());
    ic_cdk::println!("Query: {rbac_sql} ");
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = conn.prepare(&rbac_sql).unwrap();
    let mut rows = stmt.query([]).unwrap();
    ic_cdk::println!("Inner Query: pre match {rbac_sql} ");
    match rows.next() {
        Ok(row) => match row {
            Some(row) => {
                let rbac = Rbac {
                    id: row.get(0).unwrap(),
                    principal: row.get(1).unwrap(),
                    friendly_name: row.get(2).unwrap(),
                    view_opera_ok: row.get(3).unwrap(),
                    add_opera_ok: row.get(4).unwrap(),
                    associate_dna_ok: row.get(5).unwrap(),
                    add_dna_ok: row.get(6).unwrap(),
                    admin_ok: row.get(7).unwrap(),
                };
                return Ok(rbac);
            }
            None => {
                return Err(MyError::CanisterError {
                    message: format!("{:?}", "Not existent principal."),
                })
            }
        },
        Err(err) => {
            return Err(MyError::CanisterError {
                message: format!("{:?}: {:?}", "Rbac query error.", err),
            })
        }
    };
}

/// insert  in rbac the data  for a new user, with sane defaults (only view)
#[update]
pub fn insert_caller(friendly_name: String) -> ExecResult {
    let caller = ic_cdk::caller();
    let principal = caller.to_string();
    let conn = ic_sqlite::CONN.lock().unwrap();
    ic_cdk::println!("insert_caller");
    let rbac_insert_sql = format!(
        "insert into rbac \
                (principal, friendly_name, view_opera_ok, add_opera_ok, associate_dna_ok, add_dna_ok, admin_ok) 
                values ('{}', '{}', {}, {}, {}, {}, {})",
        principal, friendly_name, true, false, false, false, false
    );
    ic_cdk::println!("insert_caller: {rbac_insert_sql} ");
    return match conn.execute(&rbac_insert_sql, []) {
        Ok(ok) => return Ok(format!("insert_caller: inserted {principal}, with return {ok}")),
        Err(err) => Err(MyError::CanisterError {
            message: format!("{:?}", err),
        }),
    };
}
/// change rbac flags
#[update]
pub fn change_rbac(jstring: String) -> ExecResult {
    ic_cdk::println!("change rbac input: {jstring} ");
    let r: Rbac = serde_json::from_str(&jstring).unwrap();

    let caller = ic_cdk::caller();
    let principal = caller.to_string();
    let conn = ic_sqlite::CONN.lock().unwrap();
    ic_cdk::println!("insert_caller");
    let change_rbac_sql = format!(
        "update rbac set \
            view_opera_ok = {}, add_opera_ok = {}, associate_dna_ok = {}, add_dna_ok = {}, admin_ok = {} 
            where principal = '{}'", 
            r.view_opera_ok, r.add_opera_ok, r.associate_dna_ok, r.add_dna_ok, r.admin_ok, r.principal
    );
    ic_cdk::println!("change_rbac sql: {change_rbac_sql} ");
    return match conn.execute(&change_rbac_sql, []) {
        Ok(ok) => return Ok(format!("change_rbac: updated {} permissions, with return {}", principal, ok )),
        Err(err) => Err(MyError::CanisterError {
            message: format!("{:?}", err),
        }),
    };
}
