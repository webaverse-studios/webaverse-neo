use std::rc::Rc;

use bevy::prelude::*;
use tokio::sync::{Mutex, MutexGuard};
use type_map::TypeMap;
use wasm_bindgen::prelude::*;

use crate::{OpNames, Ops, ScriptInfo};

const LOCK_SHOULD_NOT_FAIL: &str =
    "Mutex lock should not fail because there should be no concurrent access";

#[wasm_bindgen]
struct BevyModJsScripting {
    state: Rc<Mutex<JsRuntimeState>>,
}

impl BevyModJsScripting {
    /// Lock the state and panic if the lock cannot be obtained immediately.
    fn state(&self) -> MutexGuard<JsRuntimeState> {
        self.state.try_lock().expect(LOCK_SHOULD_NOT_FAIL)
    }
}

struct JsRuntimeState {
    script_info: ScriptInfo,
    op_state: TypeMap,
    ops: Ops,
    op_names: OpNames,
    world: World,
}

#[wasm_bindgen(module = "/src/runtime/js/wasm_setup.js")]
extern "C" {
    fn setup_js_globals(bevy_mod_js_scripting: BevyModJsScripting, op_name_map: &str);
}
