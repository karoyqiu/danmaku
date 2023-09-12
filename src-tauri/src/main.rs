// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;

use error::Result;
use tauri::{AppHandle, Manager};
use window_vibrancy::{apply_acrylic, clear_acrylic};

#[tauri::command]
fn enable_background(app: AppHandle) -> Result<()> {
  log::info!("Enable background");
  let window = app.get_window("main").unwrap();
  let result = apply_acrylic(&window, Some((18, 18, 18, 125)));

  if let Err(error) = result {
    log::error!("{}", error);
  }

  Ok(())
}

#[tauri::command]
fn disable_background(app: AppHandle) -> Result<()> {
  log::info!("Disable background");
  let window = app.get_window("main").unwrap();
  let result = clear_acrylic(&window);

  if let Err(error) = result {
    log::error!("{}", error);
  }

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
