use regex::Regex;
use rusqlite::functions::Context;
use rusqlite::functions::FunctionFlags;
use rusqlite::Connection;
use rusqlite::OpenFlags;
use std::fs;
use std::io::{Read, Write};
use tauri::AppHandle;
use tauri::Manager;

pub(crate) fn get_database_connection(app: &AppHandle) -> Connection {
    let data_dir = app
        .path()
        .app_local_data_dir()
        .expect("Could not fetch data dir");
    if !data_dir.exists() {
        fs::create_dir_all(data_dir.clone()).expect("Could not create data dir");
    }

    let database_path = data_dir.join("data.db");

    if database_path.exists() {
        fs::remove_file(database_path.clone()).unwrap();
    }

    let path_resolver = app.path();

    let txt_file_path = path_resolver.resolve("assets/test.txt", tauri::path::BaseDirectory::Resource).unwrap();
    let txt_content = std::fs::read_to_string(&txt_file_path).unwrap();
    dbg!(&txt_content);

    // if !database_path.exists() {
    dbg!("Creating database");
    let empty_db_path = path_resolver
        .resolve("assets/empty.db", tauri::path::BaseDirectory::Resource)
        .expect("Could not retrieve empty database from resources");
    dbg!("Empty DB path:");
    dbg!(&empty_db_path);
    dbg!(&empty_db_path.exists());
    let mut empty_file = fs::File::open(&empty_db_path).unwrap();
    dbg!(&empty_file);
    let mut db_content = Vec::new();
    empty_file.read_to_end(&mut db_content).unwrap();
    let mut file = fs::File::create_new(database_path.clone()).unwrap();
    file.write_all(&db_content).unwrap();
    file.sync_all().unwrap();
    // }

    dbg!(&database_path);

    let database_flags = get_database_flags();

    let mut conn = Connection::open_with_flags(database_path, database_flags)
        .expect("Could not open database.");

    conn.create_scalar_function(
        "regexp",
        2,
        FunctionFlags::SQLITE_UTF8 | FunctionFlags::SQLITE_DETERMINISTIC,
        regexp_with_auxilliary,
    )
    .expect("Could not add regexp function to database");

    let migrations = rusqlite_migration::Migrations::new(migrations());
    migrations.to_latest(&mut conn).unwrap();

    conn
}

fn get_database_flags() -> OpenFlags {
    let mut db_flags = OpenFlags::empty();

    db_flags.insert(OpenFlags::SQLITE_OPEN_READ_WRITE);
    db_flags.insert(OpenFlags::SQLITE_OPEN_CREATE);
    db_flags.insert(OpenFlags::SQLITE_OPEN_FULL_MUTEX);
    db_flags.insert(OpenFlags::SQLITE_OPEN_NOFOLLOW);
    db_flags.insert(OpenFlags::SQLITE_OPEN_PRIVATE_CACHE);

    db_flags
}

// Code borrowed from rusqlite's unit test suite that implemented regex with auxilliary functions.
// --------------------------------------
// This implementation of a regexp scalar function uses SQLite's auxiliary data
// (https://www.sqlite.org/c3ref/get_auxdata.html) to avoid recompiling the regular
// expression multiple times within one query.
fn regexp_with_auxilliary(ctx: &Context<'_>) -> rusqlite::Result<bool> {
    assert_eq!(ctx.len(), 2, "called with unexpected number of arguments");
    type BoxError = Box<dyn std::error::Error + Send + Sync + 'static>;
    let regexp: std::sync::Arc<Regex> = ctx.get_or_create_aux(0, |vr| -> Result<_, BoxError> {
        Ok(Regex::new(vr.as_str()?)?)
    })?;

    let is_match = {
        let text = ctx
            .get_raw(1)
            .as_str()
            .map_err(|e| rusqlite::Error::UserFunctionError(e.into()))?;

        regexp.is_match(text)
    };

    Ok(is_match)
}

// fn fallback_database_dir() -> PathBuf {
//     let project_dir = env::current_exe().expect("Could not determine current executable directory")
//         .parent().expect("Could not determine parent directory to current executable")
//         .join(".creaminder_dev");
//
//     if !project_dir.exists() {
//         fs::create_dir_all(&project_dir).expect(format!("Could not create fallback database directory in {}", &project_dir.display()).as_ref());
//     }
//
//     project_dir
// }

fn migrations() -> Vec<rusqlite_migration::M<'static>> {
    vec![rusqlite_migration::M::up(include_str!(
        "./migrations/0-init.sql"
    ))]
}
