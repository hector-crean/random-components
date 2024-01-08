use std::path::PathBuf;

use clap::{arg, Args, Command, FromArgMatches as _, Parser};

use ranodes::server::{run, ServerError};

/// Simple program to greet a person
#[derive(Parser)]
pub struct Cli {
    #[arg(short, long)]
    dir_root: PathBuf,
    #[arg(short, long, default_value_t = 1234)]
    port: u16,
}

#[tokio::main]
async fn main() -> Result<(), ServerError> {
    let Cli { port, dir_root } = Cli::parse();

    run(port, dir_root).await
}
