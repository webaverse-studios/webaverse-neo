use bevy::{
    prelude::{warn, World},
    utils::HashMap,
};

use crate::{JsRuntimeOp, OpContext, OpIndexes, OpMap, OpNames, Ops};

mod ops;
pub use ops::*;
mod wasm;
pub use wasm::*;

struct InvalidOp;
impl JsRuntimeOp for InvalidOp {
    fn run(
        &self,
        _context: OpContext,
        _world: &mut World,
        _args: serde_json::Value,
    ) -> anyhow::Result<serde_json::Value> {
        anyhow::bail!(
            "Invalid operation. You may have forgotten to register a custom JsRuntimeOp."
        );
    }
}

fn get_ops(custom_ops: OpMap) -> (Ops, OpIndexes, OpNames) {
    // Collect core ops
    let mut op_map = ops::get_core_ops();

    // Add custom ops to core ops and warn about conflicts
    for (op_name, op) in custom_ops.into_iter() {
        if op_map.insert(op_name, op).is_some() {
            warn!(
                "Custom op name {op_name} conflicts with core op with \
                    the same name. Custom op will take precedence."
            );
        }
    }

    // Collect ops into a vector while mapping the op names to it's index in the vector
    let mut ops: Ops = Vec::with_capacity(op_map.len() + 1);
    ops.push(Box::new(InvalidOp)); // The first op is the invalid op called when an op is not found
    let op_indexes = op_map
        .into_iter()
        .map(|(name, op)| {
            ops.push(op);
            (name, ops.len() - 1)
        })
        .collect::<HashMap<_, _>>();

    // Create reverse lookup so we can get the op name from the index for debugging/logging purposes
    let op_names = op_indexes
        .clone()
        .into_iter()
        .map(|(k, v)| (v, k))
        .collect();
    let op_names = OpNames(op_names);

    (ops, op_indexes, op_names)
}
