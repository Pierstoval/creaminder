use rusqlite::Connection;
use std::ops::Deref;
use std::sync::Mutex;
use tauri::State;
use crate::domain::activity;
use crate::domain::activity::Activity;

#[tauri::command(rename_all = "snake_case")]
pub(crate) fn list_activities(
    conn_state: State<'_, Mutex<Connection>>,
) -> Vec<Activity> {
    let conn = conn_state
        .inner()
        .lock()
        .expect("Could not retrieve database connection");
    let conn = conn.deref();

    activity::find_all(conn)
    //serde_json::to_string(&activity::find_all(conn)).expect("Could not serialize activities properly")
}
