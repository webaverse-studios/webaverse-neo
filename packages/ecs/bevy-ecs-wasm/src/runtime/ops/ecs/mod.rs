use crate::{JsRuntimeOp, OpMap};
pub mod types;

/// Op used to provide the JS classes and globals used to interact with the other ECS ops
struct EcsJs;
impl JsRuntimeOp for EcsJs {
    fn js(&self) -> Option<&'static str> {
        Some(include_str!("./ecs.js"))
    }
}

pub fn insert_ecs_ops(ops: &mut OpMap) {
    ops.insert("ecs.js", Box::new(EcsJs));
}
