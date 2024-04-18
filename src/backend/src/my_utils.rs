extern crate ic_cdk_macros;
extern crate serde;
use ic_cdk::api::call::RejectionCode;
use candid::CandidType;
use serde::{Deserialize};

#[derive(Debug, CandidType, Deserialize)]
pub enum MyError {
    InvalidCanister,
    CanisterError { message: String },
}

pub type ExecResult<T = String, E = MyError> = std::result::Result<T, E>;
pub type JsonResult<T = String, E = MyError> = std::result::Result<T, E>;
pub type QueryResult<T = Vec<Vec<String>>, E = MyError> = std::result::Result<T, E>;

impl From<(RejectionCode, String)> for MyError {
    fn from((code, message): (RejectionCode, String)) -> Self {
        match code {
            RejectionCode::CanisterError => Self::CanisterError { message },
            _ => Self::InvalidCanister,
        }
    }
}

