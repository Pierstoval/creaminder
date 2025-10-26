use std::{env, fs};
use regex::Regex;
use rusqlite::functions::Context;
use rusqlite::functions::FunctionFlags;
use rusqlite::Connection;
use rusqlite::OpenFlags;
use std::path::PathBuf;
use std::fs::File;

pub(crate) fn get_database_connection(data_dir: Result<PathBuf, tauri::Error>) -> Connection {
    dbg!(&data_dir);

    let database_path = if data_dir.is_ok() {
        data_dir.unwrap()
    } else {
        fallback_database_dir()
    };

    if !database_path.exists() {
        fs::create_dir_all(&database_path).expect(format!("Could not create database directory in {}", &database_path.display()).as_ref());
    }

    let res = File::options()
        .read(false)
        .write(true)
        .open(database_path.clone());

    dbg!(&res);

    let database_file = database_path.join("creaminder.db3");

    let res = File::options()
        .read(false)
        .write(true)
        .open(database_file.clone());

    dbg!(&res);

    let database_flags = get_database_flags();

    let mut conn = Connection::open_with_flags(database_file, database_flags)
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

fn fallback_database_dir() -> PathBuf {
    let project_dir = env::current_exe().expect("Could not determine current executable directory")
        .parent().expect("Could not determine parent directory to current executable")
        .join(".creaminder_dev");

    if !project_dir.exists() {
        fs::create_dir_all(&project_dir).expect(format!("Could not create fallback database directory in {}", &project_dir.display()).as_ref());
    }

    project_dir
}

fn migrations() -> Vec<rusqlite_migration::M<'static>> {
    vec![
        rusqlite_migration::M::up(include_str!("./migrations/0-init.sql")),
    ]
}
