import { DynamicTool } from 'langchain/tools'
import { OpenAI } from 'langchain'

const agent_memory = {}

const writing_model = new OpenAI({
  temperature: 0,
  openAIApiKey: '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',
  modelName: 'gpt-3.5-turbo',
})

const tools = [
  new DynamicTool({
    name: 'Remember',
    description:
      'Useful when you want to remember information about an object. The input should be the key for a json object stored in memory. If the key is not found, the agent will return "No memory found for" + {input}',
    func: (input) => {
      if (agent_memory[input]) {
        return 'Remembered: ' + JSON.stringify(agent_memory[input])
      }
      return 'No memory found for ' + input
    },
  }),
  new DynamicTool({
    name: 'Memorize',
    description:
      'Useful when you want store information about an object. The input should be a json object, with the key being the name of the object and the values the information to memorize. Only store one object at a time',
    func: (input) => {
      const data = JSON.parse(input)
      Object.keys(data).forEach((key) => {
        agent_memory[key] = data[key]
      })
      return 'Memorized: ' + JSON.stringify(agent_memory)
    },
  }),
  new DynamicTool({
    name: 'Write',
    description:
      'Useful when you want to write text using a LLM. The input should be the prompt that the LLM will use to generate text. The output will be the generated text. You need to specify all the information necessary for an accurate description',
    func: (input) => {
      return input
    },
  }),
]

export default tools
