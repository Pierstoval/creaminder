use std::sync::Mutex;
use crate::db::get_database_connection;
use tauri::Manager;

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

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let data_dir = app.path().app_cache_dir();

            let conn = get_database_connection(data_dir);

            let app_handle = app.handle();
            app_handle.manage(Mutex::new(conn));

            Ok(())
        })
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
