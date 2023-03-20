import ort from 'onnxruntime-web'
import { getRgbData } from './onnx-utils.js'
import { cosineSimilarity } from './clip-utils.js'
import { softmax } from './clip-utils.js'
import { img_session } from './onnx-sessions.js'
import { emotion_tokens } from './emotions.js'

/**
 *
 */
export async function computeVisualSentiment(img_blob) {
  const rgbData = await getRgbData(img_blob)
  const img_feeds = {
    input: new ort.Tensor('float32', rgbData, [1, 3, 224, 224]),
  }
  const img_results = await img_session.run(img_feeds)
  const img_data = img_results['output'].data

  const results = []
  for (let i = 0; i < emotion_tokens.length; i++) {
    const emotion_token = emotion_tokens[i]

    // compute the cosine similarity between img_data and txt_data
    const similarity = cosineSimilarity(img_data, emotion_token)
    results.push(similarity)
  }

  const softmax_results = softmax(results)
  const emotional_score =
    softmax_results[0] -
    softmax_results[1] -
    softmax_results[2] -
    softmax_results[3] +
    softmax_results[4] +
    softmax_results[5]
  return emotional_score
}
