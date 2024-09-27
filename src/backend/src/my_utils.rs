extern crate ic_cdk_macros;
extern crate serde;
use ic_cdk::api::call::RejectionCode;
use ic_cdk::{query, update};
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
        ic_cdk::println!("Inner Query: pre match {rbac_sql} ");
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


#[update]
pub fn insert_caller() -> ExecResult {
    let caller = ic_cdk::caller();
    let principal = caller.to_string();
            let conn = ic_sqlite::CONN.lock().unwrap();
            ic_cdk::println!("insert_caller");
            let rbac_insert_sql = format!("insert into rbac \
                (principal, friendly_name, view_opera_ok, add_opera_ok, associate_dna_ok, add_dna_ok) 
                values ('{}', '{}', {}, {}, {}, {})",
                principal, principal, true, false, false,  false
                );
            ic_cdk::println!("insert_caller: {rbac_insert_sql} ");
            return match conn.execute(
                &rbac_insert_sql,
                []
            ) {
                Ok(ok) => return Ok(format!("insert_caller: inserted {principal}, with return {ok}")),
                Err(err) => Err(MyError::CanisterError {message: format!("{:?}", err) })
            }
}


