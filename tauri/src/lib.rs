use std::fs;
use tauri::{AppHandle, Manager, Emitter};
use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;

#[tauri::command]
async fn run_inference(app: AppHandle, model_path: String, study_path: String) -> Result<String, String> {
    println!("Starting inference for study: {}", study_path);

    let sidecar_command = app.shell().sidecar("sidecar")
        .map_err(|e| format!("Failed to create sidecar command: {}", e))?
        .args(["--model", &model_path, "--study", &study_path]);

    let (mut rx, mut _child) = sidecar_command.spawn()
        .map_err(|e| format!("Failed to spawn sidecar: {}", e))?;

    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(line) => {
                    let line_str = String::from_utf8_lossy(&line);
                    println!("Sidecar STDOUT: {}", line_str);
                    let _ = app.emit("sidecar-stdout", line_str.to_string());
                }
                CommandEvent::Stderr(line) => {
                    let line_str = String::from_utf8_lossy(&line);
                    eprintln!("Sidecar STDERR: {}", line_str);
                    let _ = app.emit("sidecar-stderr", line_str.to_string());
                }
                CommandEvent::Terminated(payload) => {
                    println!("Sidecar terminated with code {:?}", payload.code);
                    let _ = app.emit("sidecar-terminated", payload.code);
                }
                CommandEvent::Error(err) => {
                    eprintln!("Sidecar error: {}", err);
                    let _ = app.emit("sidecar-error", err);
                }
                _ => {}
            }
        }
    });

    Ok("Inference started".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .register_uri_scheme_protocol("oct-asset", |_app, request| {
            let uri = request.uri().path();
            // NOTE: In production, sanitize this path securely.
            let path = format!("/tmp/oct-insight{}", uri);
            
            match fs::read(&path) {
                Ok(data) => {
                    tauri::http::Response::builder()
                        .header("Access-Control-Allow-Origin", "*")
                        .header("Content-Type", "application/octet-stream")
                        .status(200)
                        .body(data)
                        .unwrap()
                }
                Err(_) => {
                    tauri::http::Response::builder()
                        .status(404)
                        .body(Vec::new())
                        .unwrap()
                }
            }
        })
        .invoke_handler(tauri::generate_handler![run_inference])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
