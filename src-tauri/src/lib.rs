use std::sync::Mutex;
use crate::db::get_database_connection;

mod config;
mod db;
mod command {
    pub(crate) mod activities;
}
mod domain {
    pub(crate) mod activity;
}
mod migrations;

// // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut conn = get_database_connection();

    let migrations = rusqlite_migration::Migrations::new(migrations::migrations());
    migrations.to_latest(&mut conn).unwrap();

    tauri::Builder::default()
        .manage(Mutex::new(conn))
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            crate::command::activities::activity_list,
            crate::command::activities::activity_create,
            crate::command::activities::activity_delete,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
