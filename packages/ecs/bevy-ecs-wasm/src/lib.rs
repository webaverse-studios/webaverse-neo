use asset::JsScript;
use js_sys::JsString;
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

use bevy_ecs::{component::ComponentInfo, prelude::World as BevyWorld};

mod asset;
mod runtime;
mod utils;

pub use runtime::*;

use crate::ecs::types::JsComponentInfo;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

type JsResult<T> = std::result::Result<T, String>;

#[wasm_bindgen(typescript_custom_section)]
const ITEXT_STYLE: &'static str = r#"
interface IJsComponentInfo {
    name: string;
    id: number;
    size: number;
}
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "IJsComponentInfo")]
    pub type IJsComponentInfo;

    #[wasm_bindgen(typescript_type = "string[]")]
    pub type StringArray;
}

impl From<&ComponentInfo> for IJsComponentInfo {
    fn from(value: &ComponentInfo) -> Self {
        let info = JsComponentInfo::from(value);

        Self {
            obj: serde_wasm_bindgen::to_value(&info).expect("Failed to convert to JsValue"),
        }
    }
}

impl From<JsComponentInfo> for IJsComponentInfo {
    fn from(info: JsComponentInfo) -> Self {
        Self {
            obj: serde_wasm_bindgen::to_value(&info).expect("Failed to convert to JsValue"),
        }
    }
}

#[wasm_bindgen]
#[derive(Default)]
pub struct World {
    raw_world: BevyWorld,
}

impl std::fmt::Display for World {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self.raw_world)
    }
}

#[wasm_bindgen]
impl World {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            raw_world: BevyWorld::new(),
        }
    }

    #[wasm_bindgen(js_name = toString)]
    pub fn as_string(&self) -> String {
        format!("{:?}", self.to_string())
    }

    #[wasm_bindgen(js_name = getComponents)]
    pub fn get_components(&self) -> Vec<IJsComponentInfo> {
        self.raw_world
            .components()
            .iter()
            .map(IJsComponentInfo::from)
            .collect::<Vec<_>>()
    }

    #[wasm_bindgen(js_name = getResources)]
    pub fn get_resources(&self) -> Vec<IJsComponentInfo> {
        let components = self.raw_world.components();

        self.raw_world
            .storages()
            .resources
            .iter()
            .map(|(id, storage)| components.get_info(id).expect("Component info not found"))
            .map(IJsComponentInfo::from)
            .collect::<Vec<_>>()
    }
}
