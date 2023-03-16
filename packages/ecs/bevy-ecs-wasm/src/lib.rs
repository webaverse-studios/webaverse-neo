use std::path::PathBuf;

use asset::JsScript;
use bevy::{ecs::storage::Resources, prelude::*, reflect::TypeRegistry, utils::HashMap};
use type_map::TypeMap;
use wasm_bindgen::prelude::wasm_bindgen;

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

pub struct OpContext<'a> {
    pub op_state: &'a mut TypeMap,
    pub script_info: &'a ScriptInfo,
    pub type_registry: &'a TypeRegistry,
}

/// Info about the currently executing script, exposed to [`JsRuntimeOp`]s.
pub struct ScriptInfo {
    pub path: PathBuf,
    pub handle: Handle<JsScript>,
}

pub trait JsRuntimeOp {
    /// Returns any extra JavaScript that should be executed when the runtime is initialized.
    fn js(&self) -> Option<&'static str> {
        None
    }

    /// The function called to execute the operation
    fn run(
        &self,
        context: OpContext<'_>,
        world: &mut World,
        args: serde_json::Value,
    ) -> anyhow::Result<serde_json::Value> {
        // Satisfy linter without changing argument names for the sake of the API docs
        let (_, _, _) = (context, world, args);

        // Ops may be inserted simply to add JS, so a default implementation of `run` is useful to
        // indicate that the op is not meant to be run.
        anyhow::bail!("Op is not meant to be called");
    }

    /// Function called at  to allow the op to do any preparation work
    fn frame_start(&self, op_state: &mut TypeMap, world: &mut World) {
        // Fix clippy warning by using variables
        let _ = (op_state, world);
    }

    fn frame_end(&self, op_state: &mut TypeMap, world: &mut World) {
        // Fix clippy warning by using variables
        let _ = (op_state, world);
    }
}

// Hash map of op names to op implementation
pub type OpMap = HashMap<&'static str, Box<dyn JsRuntimeOp>>;

/// Contains mapping from op index to op name
#[derive(Deref, DerefMut, Debug)]
struct OpNames(HashMap<usize, &'static str>);

/// Contains mapping from op name to op index
pub type OpIndexes = HashMap<&'static str, usize>;

/// List of [`JsRuntimeOp`]s installed for the [`JsRuntime`]
pub type Ops = Vec<Box<dyn JsRuntimeOp>>;

type JsResult<T> = std::result::Result<T, String>;

#[wasm_bindgen]
#[derive(Default)]
pub struct WWorld {
    raw: World,
}

impl std::fmt::Display for WWorld {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self.raw)
    }
}

#[wasm_bindgen]
impl WWorld {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { raw: World::new() }
    }

    #[wasm_bindgen(js_name = toString)]
    pub fn as_string(&self) -> JsResult<String> {
        Ok(serde_json::Value::String(format!("{:?}", self.to_string())).to_string())
    }

    #[wasm_bindgen(js_name = getComponents)]
    pub fn get_components(&self) -> JsResult<String> {
        let infos = self
            .raw
            .components()
            .iter()
            .map(JsComponentInfo::from)
            .collect::<Vec<_>>();

        match serde_json::to_value(infos) {
            Ok(v) => Ok(v.to_string()),
            Err(e) => Err(e.to_string()),
        }
    }

    #[wasm_bindgen(js_name = getResources)]
    pub fn get_resources(&self) -> JsResult<String> {
        let infos = self
            .raw
            .storages()
            .resources
            .iter()
            .map(|(id, storage)| {
                self.raw
                    .components()
                    .get_info(id)
                    .expect("Component info not found")
            })
            .map(JsComponentInfo::from)
            .collect::<Vec<_>>();

        match serde_json::to_value(infos) {
            Ok(v) => Ok(v.to_string()),
            Err(e) => Err(e.to_string()),
        }
    }
}
