// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;

use error::Result;
use tauri::{AppHandle, Manager};
use window_vibrancy::{apply_acrylic, clear_acrylic};

#[tauri::command]
fn enable_background(app: AppHandle) -> Result<()> {
  let window = app.get_window("main").unwrap();
  let _ = apply_acrylic(&window, Some((18, 18, 18, 125)));
  Ok(())
}

#[tauri::command]
fn disable_background(app: AppHandle) -> Result<()> {
  let window = app.get_window("main").unwrap();
  let _ = clear_acrylic(&window);
  Ok(())
}

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .invoke_handler(tauri::generate_handler![
      enable_background,
      disable_background
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
