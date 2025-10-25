use std::sync::Mutex;
use crate::db::get_database_connection;

mod config;
mod db;
mod command {
    pub(crate) mod activities;
    pub(crate) mod activity_types;
}
mod domain {
    pub(crate) mod activity;
    pub(crate) mod activity_type;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut conn = get_database_connection();

    tauri::Builder::default()
        .manage(Mutex::new(conn))
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            crate::command::activities::activity_list,
            crate::command::activities::activity_create,
            crate::command::activities::activity_update,
            crate::command::activities::activity_find_by_id,
            crate::command::activities::activity_delete,
            crate::command::activity_types::activity_type_list,
            crate::command::activity_types::activity_type_create,
            crate::command::activity_types::activity_type_update,
            crate::command::activity_types::activity_type_find_by_id,
            crate::command::activity_types::activity_type_delete,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
