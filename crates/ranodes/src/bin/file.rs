use ranodes::{
    file::visit_nodes,
    rich_text::{RichText, RichTextProps},
    NodeProps,
};
use std::str::FromStr;
use uuid::Uuid;

fn main() -> color_eyre::eyre::Result<()> {
    color_eyre::install()?;

    let uuid_str: &str = "7a39b5e5-1ae1-40f4-b3cd-5055223d9b92";

    let rich_text_str = r#"
        [
            {
            "type": "paragraph",
            "attrs": {
                "alignment": "center"
            },
            "content": [
                {
                    "type": "text",
                    "text": "Hello, World: this has been changed!!"
                }
            ]
            }
        ]
        "#;

    let rich_text: Vec<RichText> = serde_json::from_str(rich_text_str).unwrap();

    let uuid = Uuid::from_str(uuid_str).unwrap();

    visit_nodes(
        "src/mock-data",
        uuid,
        NodeProps::RichText(RichTextProps::new(rich_text)),
    )?;

    Ok(())
}
