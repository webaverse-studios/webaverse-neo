import fs from 'fs'
import ort from 'onnxruntime-node'

const img_modelBlob = fs.readFileSync(
  './clip-image-vit-32-float32.with_runtime_opt.ort'
)
const img_model_bytes = new Uint8Array(img_modelBlob)
export const img_session = await ort.InferenceSession.create(img_model_bytes)

const txt_modelBlob = fs.readFileSync(
  './clip-text-vit-32-float32-int32.with_runtime_opt.ort'
)
const txt_model_bytes = new Uint8Array(txt_modelBlob)
export const txt_session = await ort.InferenceSession.create(txt_model_bytes)
