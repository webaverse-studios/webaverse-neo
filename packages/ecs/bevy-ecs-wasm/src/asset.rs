use std::path::PathBuf;

use bevy::reflect::TypeUuid;

#[derive(TypeUuid)]
#[uuid = "34186503-91f4-4afa-99fc-c0c3688a9439"]
pub struct JsScript {
    pub source: String,
    pub path: PathBuf,
}
