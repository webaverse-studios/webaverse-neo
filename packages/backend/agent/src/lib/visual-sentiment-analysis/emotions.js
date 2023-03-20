import { Tokenizer } from './tokenizer.js'
import ort from 'onnxruntime-web'
import { txt_session } from './onnx-sessions.js'

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

const emotion_tokens = []
for (let i = 0; i < text_prompts.length; i++) {
  const text = text_prompts[i]
  let textTokens = t.encodeForCLIP(text)
  textTokens = Int32Array.from(textTokens)
  const feeds = { input: new ort.Tensor('int32', textTokens, [1, 77]) }

  const txt_results = await txt_session.run(feeds)
  const txt_data = txt_results['output'].data
  emotion_tokens.push(txt_data)
}
export { emotion_tokens }
