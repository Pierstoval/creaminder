use std::fs;
use std::path::PathBuf;
use std::env;
use dirs;

pub(crate) fn creaminder_dir() -> PathBuf {
    let project_dir = if cfg!(debug_assertions) {
        // Local db is stored in the target directory
        env::current_exe().expect("Could not determine current directory to store database")
            .parent().expect("Another err")
            .join(".creaminder_dev")
    } else {
        // Prod/release db is stored in home dir, only "kinda" accessible place
        dirs::home_dir()
            .expect("Could not determine HOME_DIR to store database.")
            .join(".creaminder")
    };

    if !project_dir.exists() {
        fs::create_dir_all(&project_dir).expect("Could not create Creaminder directory.");
    }

    project_dir
}
