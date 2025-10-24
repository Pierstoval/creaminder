use crate::domain::activity::Activity;
use crate::domain::activity;
use rusqlite::Connection;
use std::ops::Deref;
use std::sync::Mutex;
use tauri::State;

#[tauri::command(rename_all = "snake_case")]
pub(crate) fn activity_list(conn_state: State<'_, Mutex<Connection>>, activity_type_id: Option<u32>) -> Vec<Activity> {
    let conn = conn_state.inner().lock().unwrap();
    let conn = conn.deref();

    if activity_type_id.is_some() {
        activity::find_by_activity_type(conn, activity_type_id)
    } else {
        activity::find_all(conn)
    }
}

#[tauri::command(rename_all = "snake_case")]
pub(crate) fn activity_create(conn_state: State<'_, Mutex<Connection>>,
    description: Option<String>,
    date: Option<String>,
    activity_type_id: Option<u32>,
) -> Result<Activity, String> {
    let conn = conn_state.inner().lock().unwrap();
    let conn = conn.deref();

    activity::create(conn, description, date, activity_type_id)
}

#[tauri::command(rename_all = "snake_case")]
pub(crate) fn activity_delete(conn_state: State<'_, Mutex<Connection>>,
    id: i32,
) -> Result<usize, String> {
    let conn = conn_state.inner().lock().unwrap();
    let conn = conn.deref();

    dbg!("deleting");
    dbg!(&id);

    let res = activity::delete(conn, id);

    if res.is_ok() {
        return Ok(res.unwrap());
    }

    let err = res.unwrap_err();

    Err(String::from(err.to_string()))
}
