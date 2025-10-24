use crate::domain::activity_type::ActivityType;
use crate::domain::activity_type;
use rusqlite::Connection;
use std::ops::Deref;
use std::sync::Mutex;
use tauri::State;

#[tauri::command(rename_all = "snake_case")]
pub(crate) fn activity_type_list(conn_state: State<'_, Mutex<Connection>>) -> Vec<ActivityType> {
    let conn = conn_state.inner().lock().unwrap();
    let conn = conn.deref();

    activity_type::find_all(conn)
}

#[tauri::command(rename_all = "snake_case")]
pub(crate) fn activity_type_create(
    conn_state: State<'_, Mutex<Connection>>,
    name: String,
    description: Option<String>,
) -> Result<ActivityType, String> {
    let conn = conn_state.inner().lock().unwrap();
    let conn = conn.deref();

    activity_type::create(conn, name, description)
}

#[tauri::command(rename_all = "snake_case")]
pub(crate) fn activity_type_delete(
    conn_state: State<'_, Mutex<Connection>>,
    id: i32,
) -> Result<usize, String> {
    let conn = conn_state.inner().lock().unwrap();
    let conn = conn.deref();

    let res = activity_type::delete(conn, id);

    if res.is_ok() {
        return Ok(res.unwrap());
    }

    let err = res.unwrap_err();
    Err(String::from(err.to_string()))
}

#[tauri::command(rename_all = "snake_case")]
pub(crate) fn activity_type_update(
    conn_state: State<'_, Mutex<Connection>>,
    id: i32,
    name: String,
    description: Option<String>,
) -> Result<ActivityType, String> {
    let conn = conn_state.inner().lock().unwrap();
    let conn = conn.deref();

    activity_type::update(conn, id, name, description)
}

#[tauri::command(rename_all = "snake_case")]
pub(crate) fn activity_type_find_by_id(
    conn_state: State<'_, Mutex<Connection>>,
    id: i32,
) -> Result<ActivityType, String> {
    let conn = conn_state.inner().lock().unwrap();
    let conn = conn.deref();

    activity_type::find_by_id(conn, id)
}