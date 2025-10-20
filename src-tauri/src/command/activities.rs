use rusqlite::Connection;
use std::ops::Deref;
use std::sync::Mutex;
use tauri::State;
use crate::domain::activity;

#[tauri::command]
pub(crate) fn list_activities(
    conn_state: State<'_, Mutex<Connection>>,
) -> String {
    let conn = conn_state
        .inner()
        .lock()
        .expect("Could not retrieve database connection");
    let conn = conn.deref();

    serde_json::to_string(&activity::find_all(conn))
        .expect("Could not serialize activities properly")
}
