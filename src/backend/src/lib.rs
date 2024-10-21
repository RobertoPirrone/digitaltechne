#![doc = include_str!(concat!(env!("CARGO_MANIFEST_DIR"), "/README.md"))]

//! Keep clean the main file, using ad hoc crates
extern crate ic_cdk_macros;
extern crate serde;
use ic_cdk::{export_candid};

pub mod artwork_mark;
pub mod cartridge;
pub mod documents;
pub mod gramberg_dossier;
pub mod my_utils;
pub mod rbac;
pub mod sqlite;
pub use crate::artwork_mark::{artwork_mark_insert, artwork_mark_query, ArtworkMarkQueryParams};
pub use crate::cartridge::{ cartridge_insert, cartridge_query, cartridge_use_insert, CartridgeQueryParams, CartridgeUseParams, };
pub use crate::documents::{document_insert, documenti_pulldowns, documenti_query, Documento, QueryDocumentsParams};
pub use crate::gramberg_dossier::{ dossier_insert, dossier_pulldowns, dossier_query, dossier_struct_query, Dossier, QueryParams, };
pub use crate::my_utils::*;
pub use crate::rbac::*;
pub use crate::sqlite::{execute, query};

export_candid!();
