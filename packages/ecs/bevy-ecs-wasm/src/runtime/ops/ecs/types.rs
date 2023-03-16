use bevy::ecs::component::{ComponentId, ComponentInfo};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct JsComponentId {
    pub index: usize,
}
impl From<ComponentId> for JsComponentId {
    fn from(id: ComponentId) -> Self {
        JsComponentId { index: id.index() }
    }
}
impl From<&JsComponentId> for ComponentId {
    fn from(id: &JsComponentId) -> Self {
        ComponentId::new(id.index)
    }
}

#[derive(Serialize)]
pub struct JsComponentInfo {
    pub id: JsComponentId,
    pub name: String,
    pub size: usize,
}
impl From<&ComponentInfo> for JsComponentInfo {
    fn from(info: &ComponentInfo) -> Self {
        JsComponentInfo {
            id: info.id().into(),
            name: info.name().to_string(),
            size: info.layout().size(),
        }
    }
}
