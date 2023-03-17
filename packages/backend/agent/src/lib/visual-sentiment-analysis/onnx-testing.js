import ort from 'onnxruntime-node'
import fs from 'fs'
import { getRgbDataSharp } from './onnx-utils.js'
import { Tokenizer } from './tokenizer.js'
import { cosineSimilarity } from './clip-utils.js'
import { softmax } from './clip-utils.js'

async function main() {
  const img_modelBlob = fs.readFileSync(
    './clip-image-vit-32-float32.with_runtime_opt.ort'
  )
  const img_model_bytes = new Uint8Array(img_modelBlob)
  const img_session = await ort.InferenceSession.create(img_model_bytes)

  // Get the input tensor from the image
  const img = fs.readFileSync('./18f4d442800f08504944b0f96e05112f.png')
  const img_bytes = new Uint8Array(img)
  const img_blob = new Blob([img_bytes], { type: 'image/png' })
  const rgbData = await getRgbDataSharp(img_blob)
  const img_feeds = {
    input: new ort.Tensor('float32', rgbData, [1, 3, 224, 224]),
  }
  console.log('Running inference...')
  const img_results = await img_session.run(img_feeds)
  console.log('Finished inference.')

  const img_data = img_results['output'].data

  const txt_modelBlob = fs.readFileSync(
    './clip-text-vit-32-float32-int32.with_runtime_opt.ort'
  )
  const txt_model_bytes = new Uint8Array(txt_modelBlob)
  const txt_session = await ort.InferenceSession.create(txt_model_bytes)

  const t = new Tokenizer()
  const text_prompts = [
    '((Bright)), ((Happy)), ((Joyful))',
    '((Dark)), ((Angry)), ((Wrath)), ((Hate))',
    '((Dark)), ((Sad)), ((Lonely)), ((Depressed)) ((Gloomy)), ((Overcast)), ((Muted))',
    '((Dark)), ((Nervous)), ((Anxious)), ((Stressed))',
    '((Bright)), ((Excited)), ((Energetic)), ((Happy))',
    '((Bright)), ((Calm)), ((Peaceful)), ((Relaxed)), (Somber)), ((Serene)), ((Graceful))',
    '((Foggy)), ((Tired)), ((Sleepy)), ((Relaxed)), ((Hazy)), ((Blurry))',
  ]
  const results = []
  for (let i = 0; i < text_prompts.length; i++) {
    const text = text_prompts[i]
    let textTokens = t.encodeForCLIP(text)
    textTokens = Int32Array.from(textTokens)
    const feeds = { input: new ort.Tensor('int32', textTokens, [1, 77]) }

    console.log('Running inference...')
    const txt_results = await txt_session.run(feeds)
    console.log('Finished inference.')

    const txt_data = txt_results['output'].data

    // compute the cosine similarity between img_data and txt_data
    const similarity = cosineSimilarity(img_data, txt_data)
    results.push(similarity)
  }
  console.log(results)
  const softmax_results = softmax(results)
  console.log(softmax_results)
  console.log(
    'SCORE: ',
    softmax_results[0] -
      softmax_results[1] -
      softmax_results[2] -
      softmax_results[3] +
      softmax_results[4] +
      softmax_results[5]
  )
}

main()
