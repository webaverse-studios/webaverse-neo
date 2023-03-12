mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, bevy-ecs-wasm!");
}

#[wasm_bindgen]
pub struct World {
    raw_world: bevy_ecs::World,
}

impl World {
    pub fn new() -> Self {
        Self {
            raw_world: bevy_ecs::World::new(),
        }
    }
}

pub struct Schedule {
    raw_schedule: bevy_ecs::Schedule,
}

impl Schedule {
    pub fn new() -> Self {
        Self {
            raw_schedule: bevy_ecs::Schedule::default(),
        }
    }
}
