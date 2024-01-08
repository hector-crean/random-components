use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};

use crate::{
    file::{visit_nodes, VisitNodesError},
    server::AppState,
    Node, NodeProps,
};

impl IntoResponse for VisitNodesError {
    fn into_response(self) -> Response {
        // its often easiest to implement `IntoResponse` by calling other implementations
        (StatusCode::INTERNAL_SERVER_ERROR).into_response()
    }
}

pub async fn node(
    State(AppState { dir_root }): State<AppState>,
    Path(node_id): Path<uuid::Uuid>,
    Json(props): Json<NodeProps>,
) -> Result<(), VisitNodesError> {
    visit_nodes(dir_root, node_id, props)?;
    Ok(())
}
