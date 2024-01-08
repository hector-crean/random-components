use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RichText {
    #[serde(rename = "type")]
    ty: Option<String>,
    attrs: Option<HashMap<String, serde_json::Value>>,
    content: Option<Vec<RichText>>,
    marks: Option<Vec<Mark>>,
    text: Option<String>,
    #[serde(flatten)]
    extra: HashMap<String, serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Mark {
    #[serde(rename = "type")]
    ty: String,
    attrs: Option<HashMap<String, serde_json::Value>>,
    #[serde(flatten)]
    extra: HashMap<String, serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RichTextProps {
    block: RichText,
}

impl RichTextProps {
    pub fn new(block: RichText) -> Self {
        Self { block }
    }
}

#[cfg(test)]
pub mod tests {

    use super::*;

    #[test]
    fn parse() -> () {
        let json_data = r#"
        {
            "type": "paragraph",
            "attrs": {
                "alignment": "center"
            },
            "content": [
                {
                    "type": "text",
                    "text": "Hello, World!"
                }
            ]
        }
        "#;

        let parsed_data: RichText = serde_json::from_str(json_data).unwrap();
        println!("{:?}", parsed_data);
    }
    // You can use the RichText struct to deserialize JSON data into Rust objects
}
