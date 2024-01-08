//! Example chat application using Axum.
//!
//! To run this application, navigate to the examples directory and execute:
//! ```not_rust
//! cd examples && cargo run -p example-chat
//! ```

// Import necessary crates and modules
use axum::{
    extract::{ConnectInfo, Path, State},
    response::IntoResponse,
    routing::{get, post},
    Router,
};
use dotenv::dotenv;
use std::{
    net::{Ipv4Addr, SocketAddr},
    path::PathBuf,
};
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing::info;
use tracing_subscriber::{self, layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

use crate::handlers;

// Define custom error types for the WebSocket server
#[derive(thiserror::Error, Debug)]
pub enum ServerError {
    #[error(transparent)]
    JoinError(#[from] tokio::task::JoinError),
    #[error(transparent)]
    AxumError(#[from] axum::Error),
    #[error(transparent)]
    SerdeJsonError(#[from] serde_json::Error),
}

// Define AppState to manage chat rooms
#[derive(Clone)]
pub struct AppState {
    pub dir_root: PathBuf,
}

impl AppState {
    // Constructor to create a new AppState
    pub fn new(dir_root: PathBuf) -> Self {
        Self { dir_root }
    }

    // Function to create and configure the router
    pub async fn router(self) -> Result<axum::Router, ServerError> {
        let trace_layer = TraceLayer::new_for_http();

        let router = Router::new()
            .layer(trace_layer)
            .layer(CorsLayer::permissive())
            .route("/nodes/:node_id", post(handlers::post::node))
            .with_state(self.into());

        Ok(router)
    }
}

pub async fn run(port: u16, dir_root: PathBuf) -> Result<(), ServerError> {
    dotenv().ok();

    // Initialize tracing subscriber for logging
    let env_filter = EnvFilter::try_from_default_env().unwrap_or_else(|_| {
        // axum logs rejections from built-in extractors with the `axum::rejection`
        // target, at `TRACE` level. `axum::rejection=trace` enables showing those events
        "example_tracing_aka_logging=debug,tower_http=debug,axum::rejection=trace,websocket=debug,error,info,trace".into()
    });

    tracing_subscriber::registry()
        .with(tracing_subscriber::fmt::layer())
        .with(env_filter)
        .init();

    // 0.0.0.0: This IP address is a way to specify that the socket should bind to all available network interfaces on
    // the host machine. It's a common choice when you want your service to be reachable from outside networks.
    // let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let addr = SocketAddr::from((Ipv4Addr::LOCALHOST, port));

    // Create the router and bind to a local address
    let router = AppState::new(dir_root).router().await?;

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();

    let app = router.into_make_service();

    tracing::info!("listening on {}", addr);
    axum::serve(listener, app).await.unwrap();

    Ok(())
}
