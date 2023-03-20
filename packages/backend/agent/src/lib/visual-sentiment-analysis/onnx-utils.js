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
