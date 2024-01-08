pub mod file;
pub mod handlers;
pub mod rich_text;
pub mod server;
use std::{collections::HashMap, fs, path::Path};

use rich_text::RichTextProps;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// #[derive(Debug, Serialize, Deserialize)]
// // #[serde(rename_all = "snake_case")]
// pub struct Node {
//     id: Option<Uuid>,
//     #[serde(flatten)]
//     node_type: NodeType,
// }

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "type", content = "props")]
pub enum NodeType {
    RichText(rich_text::RichTextProps),
}

#[derive(Debug, Serialize, Deserialize)]
pub enum NodeIdentifier {
    RichText,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "type", content = "props")]
pub enum NodeProps {
    RichText(rich_text::RichTextProps),
}

// pub type NodeProps = Option<HashMap<String, serde_json::Value>>;

#[derive(Debug, Serialize, Deserialize)]
pub struct Node {
    id: Option<Uuid>,
    #[serde(flatten)]
    props: NodeProps,
    // props: Option<HashMap<String, serde_json::Value>>,
}

impl Node {
    fn update(&mut self, props: NodeProps) -> () {
        self.props = props;
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Nodes {
    nodes: Vec<Node>,
}

impl<'file> Nodes {
    pub fn new(nodes: Vec<Node>) -> Self {
        Nodes { nodes }
    }

    pub fn from_file(path: &'file dyn AsRef<Path>) -> Self {
        let file = fs::File::open(path).expect("file should open read only");

        let nodes: Nodes = serde_json::from_reader(file).expect("file should be proper JSON");

        nodes
    }

    pub fn update_props(mut self, node_id: Uuid, props: &NodeProps) -> Self {
        if let Some(node) = self.nodes.iter_mut().find(|node| node.id == Some(node_id)) {
            node.props = props.clone();
        };

        self
    }
}
