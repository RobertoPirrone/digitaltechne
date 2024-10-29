//! RBAC (Role based access control) utils and return types
extern crate ic_cdk_macros;
extern crate serde;
use candid::{CandidType};
use ic_cdk::{query, update};
use serde::{Deserialize, Serialize};

use crate::my_utils::*;

#[derive(CandidType, Debug, Serialize, Deserialize)]
pub struct Rbac {
    id: u64,
    principal: String,
    pub friendly_name: Option<String>,
    pub admin_ok: bool,
    pub view_opera_ok: bool,
    pub add_opera_ok: bool,
    pub dna_mark_ok: bool,
    pub add_dna_ok: bool,
}

#[derive(CandidType, Serialize, Deserialize)]
pub struct RbacReturnStruct {
    success: bool,
    rbacs: Vec<Rbac>,
}


/// Returns the [`Rbac`] struct associated with the authenticated caller
#[query]
pub fn check_caller() -> CheckResult {
    let caller = ic_cdk::caller();
    // The anonymous principal is not allowed to interact with canister.
    // ic_cdk::println!("caller: {caller}, anon {:?} ", Principal::anonymous().to_string());
    let rbac_sql = format!("select id, principal, friendly_name, view_opera_ok, add_opera_ok, dna_mark_ok, add_dna_ok, admin_ok from rbac where principal = {:?}", caller.to_string());
    // ic_cdk::println!("Query: {rbac_sql} ");
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = conn.prepare(&rbac_sql).unwrap();
    let mut rows = stmt.query([]).unwrap();
    // ic_cdk::println!("Inner Query: pre match {rbac_sql} ");
    match rows.next() {
        Ok(row) => match row {
            Some(row) => {
                let rbac = Rbac {
                    id: row.get(0).unwrap(),
                    principal: row.get(1).unwrap(),
                    friendly_name: row.get(2).unwrap(),
                    view_opera_ok: row.get(3).unwrap(),
                    add_opera_ok: row.get(4).unwrap(),
                    dna_mark_ok: row.get(5).unwrap(),
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
    let rbac_insert_sql = format!(
        "insert into rbac \
                (principal, friendly_name, view_opera_ok, add_opera_ok, dna_mark_ok, add_dna_ok, admin_ok) 
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

    rbac_verify("change_rbac".to_string(), "admin_ok".to_string())?;
    let caller = ic_cdk::caller();
    let principal = caller.to_string();
    let conn = ic_sqlite::CONN.lock().unwrap();
    let change_rbac_sql = format!(
        "update rbac set \
            view_opera_ok = {}, add_opera_ok = {}, dna_mark_ok = {}, add_dna_ok = {}, admin_ok = {} 
            where principal = '{}'", 
            r.view_opera_ok, r.add_opera_ok, r.dna_mark_ok, r.add_dna_ok, r.admin_ok, r.principal
    );
    ic_cdk::println!("change_rbac sql: {change_rbac_sql} ");
    return match conn.execute(&change_rbac_sql, []) {
        Ok(ok) => return Ok(format!("change_rbac: updated {} permissions, with return {}", principal, ok )),
        Err(err) => Err(MyError::CanisterError {
            message: format!("{:?}", err),
        }),
    };
}

/// Returns the [`Rbac`] struct for every user
#[query]
pub fn rbac_query() -> JsonResult {
    let mut res: Vec<Rbac> = Vec::new();
    rbac_verify("change_rbac".to_string(), "admin_ok".to_string())?;
    let rbac_sql = format!("select id, principal, friendly_name, view_opera_ok, add_opera_ok, dna_mark_ok, add_dna_ok, admin_ok from rbac");
    // ic_cdk::println!("Query: {rbac_sql} ");
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = conn.prepare(&rbac_sql).unwrap();
    let mut rows = stmt.query([]).unwrap();

    loop {
        match rows.next() {
            Ok(row) => match row {
                Some(row) => {
                    let rbac = Rbac {
                        id: row.get(0).unwrap(),
                        principal: row.get(1).unwrap(),
                        friendly_name: row.get(2).unwrap(),
                        view_opera_ok: row.get(3).unwrap(),
                        add_opera_ok: row.get(4).unwrap(),
                        dna_mark_ok: row.get(5).unwrap(),
                        add_dna_ok: row.get(6).unwrap(),
                        admin_ok: row.get(7).unwrap(),
                    };
                    res.push(rbac);
                },
                None => break,
            },
            Err(err) => {
                return Err(MyError::CanisterError {
                    message: format!("{:?}", err),
                })
            }
        }
    }
    let ret_payload = RbacReturnStruct {
        success: true,
        rbacs: res
    };
    let jres = serde_json::to_string(&ret_payload).unwrap();
    ic_cdk::println!("JRES: {jres} ");
    Ok(jres)
}

/// check if user is allowed to perform the operation
#[query]
pub fn rbac_verify(calling_function: String, capability: String) -> ExecResult {
    let checked_caller: Rbac = check_caller()?;
    let caller = ic_cdk::caller().to_string();
    let flag: bool;
    match  capability.as_str() {
        "view_opera_ok" => flag = checked_caller.view_opera_ok,
        "add_opera_ok" => flag = checked_caller.add_opera_ok,
        "dna_mark_ok" => flag = checked_caller.dna_mark_ok,
        "add_dna_ok" => flag = checked_caller.add_dna_ok,
        "admin_ok" => flag = checked_caller.admin_ok,
        _ => flag = false,
    }
    ic_cdk::println!("rbac_verify: calling_function {:?}, capability {:?}, caller {:?}, result {:?}", calling_function, capability, caller, flag);
    if !flag {
        return Err(MyError::CanisterError {
            message: format!("{:?}: capability {:?} not allowed for user {:?}", calling_function, capability, caller ),
        });
    }
    return Ok("OK".to_string()) ;
}
