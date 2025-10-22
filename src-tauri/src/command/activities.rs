use crate::domain::activity::Activity;
use crate::domain::activity;
use rusqlite::Connection;
use std::ops::Deref;
use std::sync::Mutex;
use tauri::State;

#[tauri::command(rename_all = "snake_case")]
pub(crate) fn activity_list(conn_state: State<'_, Mutex<Connection>>) -> Vec<Activity> {
    let conn = conn_state.inner().lock().unwrap();
    let conn = conn.deref();

    activity::find_all(conn)
}

#[tauri::command(rename_all = "snake_case")]
pub(crate) fn activity_create(conn_state: State<'_, Mutex<Connection>>,
    description: Option<String>,
    date: Option<String>,
) -> Result<Activity, String> {
    let conn = conn_state.inner().lock().unwrap();
    let conn = conn.deref();

    activity::create(conn, description, date)
}
