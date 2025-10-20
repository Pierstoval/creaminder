// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config;
mod command {
    pub(crate) mod activities;
}
mod domain {
    pub(crate) mod activity;
}
mod db;
mod migrations;

fn main() {
    creaminder_lib::run()
}
