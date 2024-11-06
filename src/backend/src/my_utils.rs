//! RBAC (Role based access control) utils and return types
extern crate ic_cdk_macros;
extern crate serde;
use candid::CandidType;
use ic_cdk::api::call::RejectionCode;
use ic_cdk::query;
use serde::Deserialize;

use crate::rbac::*;

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

#[query]
pub fn whoami() -> String {
    let caller = ic_cdk::caller();
    caller.to_string()
}
