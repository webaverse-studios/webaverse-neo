import { Configuration, OpenAIApi } from 'openai'

export const openai = new OpenAIApi( new Configuration({
  //eslint-disable-next-line no-undef
  apiKey: process.env.OPENAI_API_KEY,
}))
