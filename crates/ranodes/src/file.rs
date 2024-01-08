/**
 * We want to iterate through the files in the directory:
 *  
 */
use walkdir::{DirEntry, WalkDir};

use lazy_static::lazy_static;
use regex::Regex;
use serde_json::Value;
use std::vec::IntoIter;
use std::{fs, io, ops::Deref, path::Path, str::FromStr};

use crate::{Node, NodeProps, Nodes};

#[derive(thiserror::Error, Debug)]
pub enum VisitNodesError {
    #[error(transparent)]
    WalkDir(#[from] walkdir::Error),
    #[error(transparent)]
    SerdeJson(#[from] serde_json::Error),
}
pub fn visit_nodes<P: AsRef<Path>>(
    path: P,
    node_id: uuid::Uuid,
    props: NodeProps,
) -> Result<(), VisitNodesError> {
    let walker = WalkDir::new(path);

    for entry in walker.into_iter() {
        let entry = entry?;

        let meta = entry.metadata()?;

        if meta.is_file() {
            let nodes = Nodes::from_file(&entry.path());

            println!("{:?}", &nodes);

            let nodes = nodes.update_props(node_id, &props);

            let s = serde_json::to_string(&nodes)?;

            fs::write(entry.path(), s);
        }
    }

    Ok(())
}
