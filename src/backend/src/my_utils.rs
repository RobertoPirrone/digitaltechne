extern crate ic_cdk_macros;
extern crate serde;
use ic_cdk::api::call::RejectionCode;
use ic_cdk::{query};
use candid::{CandidType, Principal};
use serde::{Deserialize};

#[derive(Debug, CandidType, Deserialize)]
pub enum MyError {
    InvalidCanister,
    CanisterError { message: String },
}

pub type ExecResult<T = String, E = MyError> = std::result::Result<T, E>;
pub type JsonResult<T = String, E = MyError> = std::result::Result<T, E>;
pub type QueryResult<T = Vec<Vec<String>>, E = MyError> = std::result::Result<T, E>;
pub type CheckResult<T = Rbac, E = MyError> = std::result::Result<T, E>;

impl From<(RejectionCode, String)> for MyError {
    fn from((code, message): (RejectionCode, String)) -> Self {
        match code {
            RejectionCode::CanisterError => Self::CanisterError { message },
            _ => Self::InvalidCanister,
        }
    }
}

#[derive(CandidType, Debug, Deserialize)]
pub struct Rbac {
    id: u64,
    principal: String,
    pub friendly_name: Option<String>,
    pub view_opera_ok: bool,
    pub add_opera_ok: bool,
    pub associate_dna_ok: bool,
    pub add_dna_ok: bool
}

#[query]
pub fn check_caller() -> CheckResult {
    let caller = ic_cdk::caller();
    // The anonymous principal is not allowed to interact with canister.
    ic_cdk::println!("caller: {caller}, anon {:?} ", Principal::anonymous().to_string());
    if caller == Principal::anonymous() {
        Err(MyError::CanisterError {message: format!("{:?}", "Anonymous principal not allowed to make calls.") })
    } else {
        let rbac_sql = format!("select * from rbac where principal = {:?}", caller.to_string());
        ic_cdk::println!("Query: {rbac_sql} ");
        let conn = ic_sqlite::CONN.lock().unwrap();
        let mut stmt = conn.prepare(&rbac_sql).unwrap();
        let mut rows = stmt.query([]).unwrap();
        match rows.next() {
            Ok(row) => {
                match row {
                    Some(row) => {
                        let rbac = Rbac {
                            id: row.get(0).unwrap(),
                            principal: row.get(1).unwrap(),
                            friendly_name: row.get(2).unwrap(), 
                            view_opera_ok: row.get(3).unwrap(),
                            add_opera_ok: row.get(4).unwrap(),
                            associate_dna_ok: row.get(5).unwrap(),
                            add_dna_ok: row.get(6).unwrap()
                        };
                        return Ok(rbac);
                    },
                    None => { return Err(MyError::CanisterError {message: format!("{:?}", "Not existent principal.") })}
                }
            },
            Err(err) => { return Err(MyError::CanisterError {message: format!("{:?}: {:?}", "Rbac query error.", err) })}
        };

    }
}


