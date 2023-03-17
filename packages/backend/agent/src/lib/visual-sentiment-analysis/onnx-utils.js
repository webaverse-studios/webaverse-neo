import ort from 'onnxruntime-node'
import fs from 'fs'
import { promisify } from 'util'
import sharp from 'sharp'

async function getImageTensorFromPath(path, dims = [1, 3, 224, 224]) {
  // 1. load the image
  const image = await loadImagefromPath(path, dims[2], dims[3])
  // 2. convert to tensor
  return imageDataToTensor(image, dims)
}

const readFileAsync = promisify(fs.readFile)

async function loadImagefromPath(path, width = 224, height = 224) {
  const imageBuffer = await readFileAsync(path)
  return await sharp(imageBuffer).resize(width, height).toBuffer()
}

function imageDataToTensor(image, dims) {
  // 1. Get buffer data from image and create R, G, and B arrays.
  console.log(image)
  const imageBufferData = new Uint8Array(image)
  console.log(imageBufferData)
  const rgbData = []

  // 2. Loop through the image buffer and extract the R, G, and B channels
  for (let i = 0; i < imageBufferData.length; i += 3) {
    const red = imageBufferData[i] / 255
    const green = imageBufferData[i + 1] / 255
    const blue = imageBufferData[i + 2] / 255
    rgbData.push((red - 0.48145466) / 0.26862954)
    rgbData.push((green - 0.4578275) / 0.26130258)
    rgbData.push((blue - 0.40821073) / 0.27577711)
  }
  // 5. create the tensor object from onnxruntime-web.
  console.log(rgbData)
  const float32Array = new Float32Array(rgbData)
  return new ort.Tensor('float32', float32Array, dims)
}

/**
 *
 */
export async function getRgbData(imageBlob) {
  const img = await createImageBitmap(imageBlob)
  const canvas = new OffscreenCanvas(224, 224)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  const rgbData = [[], [], []] // [r, g, b]
  // remove alpha and put into correct shape:
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    const x = (i / 4) % canvas.width
    const y = Math.floor(i / 4 / canvas.width)
    if (!rgbData[0][y]) rgbData[0][y] = []
    if (!rgbData[1][y]) rgbData[1][y] = []
    if (!rgbData[2][y]) rgbData[2][y] = []
    rgbData[0][y][x] = d[i + 0] / 255
    rgbData[1][y][x] = d[i + 1] / 255
    rgbData[2][y][x] = d[i + 2] / 255
    // From CLIP repo: Normalize(mean=(0.48145466, 0.4578275, 0.40821073), std=(0.26862954, 0.26130258, 0.27577711))
    rgbData[0][y][x] = (rgbData[0][y][x] - 0.48145466) / 0.26862954
    rgbData[1][y][x] = (rgbData[1][y][x] - 0.4578275) / 0.26130258
    rgbData[2][y][x] = (rgbData[2][y][x] - 0.40821073) / 0.27577711
  }
  const flatData = rgbData.flat().flat()
  return new Float32Array(flatData)
}

export async function getRgbDataSharp(imageBlob) {
  console.log('getRgbDataSharp', imageBlob)
  const tmp_buffer = await imageBlob.arrayBuffer()
  console.log('buffer', tmp_buffer)
  const imgBuffer = new Uint8Array(tmp_buffer)
  console.log('imgBuffer', imgBuffer)
  const buffer = await sharp(imgBuffer).resize(224, 224)
  console.log('buffer', buffer)
  let rgbData = [[], [], []]
  for (let i = 0; i < buffer.length; i += 3) {
    let x = (i / 3) % 224
    let y = Math.floor(i / 3 / 224)
    if (!rgbData[0][y]) rgbData[0][y] = []
    if (!rgbData[1][y]) rgbData[1][y] = []
    if (!rgbData[2][y]) rgbData[2][y] = []
    // normalize the pixel values
    rgbData[0][y][x] = (buffer[i] / 255 - 0.48145466) / 0.26862954
    rgbData[1][y][x] = (buffer[i + 1] / 255 - 0.4578275) / 0.26130258
    rgbData[2][y][x] = (buffer[i + 2] / 255 - 0.40821073) / 0.27577711
  }
  rgbData = Float32Array.from(rgbData.flat().flat())
  return rgbData
}
