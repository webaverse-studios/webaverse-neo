use bevy::ecs::component::ComponentInfo;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Serialize, Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct JsComponentInfo {
    pub id: usize,
    pub size: usize,
    pub name: String,
}

impl From<&ComponentInfo> for JsComponentInfo {
    fn from(info: &ComponentInfo) -> Self {
        JsComponentInfo {
            id: info.id().index(),
            size: info.layout().size(),
            name: info.name().to_string(),
        }
    }
}
