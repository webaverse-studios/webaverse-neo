import tools from './tools.js'
import { OpenAI } from 'langchain'
import { ZeroShotAgent, AgentExecutor } from 'langchain/agents'
import { LLMChain } from 'langchain/chains'
import { initializeAgentExecutor } from 'langchain/agents'

export const run = async () => {
  const model = new OpenAI({
    temperature: 0,
    openAIApiKey: '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',
    modelName: 'gpt-3.5-turbo',
  })

  const prefix = `You are a player in the video game "Upstreet". You are given the current Observable State of the game you are in. Write a detailed summary of the situation you are currently in, that can be used to plan your next actions. To do so you need to keep track of your interactions with the environment, so extract important information from the Observed State and store them in your memory. You have access to the following tools:`
  const suffix = `Finally, remember after storing the new information and extracting necessary information from your memory write the detailed context prompt. Remember you are in a video game, so real world laws might not apply. The final output should be exactly the output that was generated using "Write". Begin!

Observed State: {input}
{agent_scratchpad}`

  const createPromptArgs = {
    suffix,
    prefix,
    inputVariables: ['input', 'agent_scratchpad'],
  }

  const prompt = ZeroShotAgent.createPrompt(tools, createPromptArgs)

  const llmChain = new LLMChain({ llm: model, prompt })

  const agent = new ZeroShotAgent({
    llmChain: llmChain,
    allowedTools: ['Remember', 'Memorize'],
  })

  const executor = await initializeAgentExecutor(
    tools,
    model,
    'zero-shot-react-description',
    true
  )

  console.log('Loaded agent.')
  const input = `You:{"position":{"x":0,"y":0,"z":0},"rotation":{"x":0,"y":0,"z":0}} Surroundings:{"sword": {"position":[0,0,0],"rotation":[0,0,0]}},"bob": {"position":[0,0,0],"rotation": [0,0,0]}}`

  console.log(`Executing with input "${input}"...`)

  const result = await executor.call({ input })
  console.log(`Got Result ${Object.keys(result)}`)
  console.log(`Got output ${result.output}`)
}

run()

// import { OpenAI } from 'langchain/llms'
// import { ZeroShotAgent, AgentExecutor } from 'langchain/agents'
// import { Calculator } from 'langchain/tools'
// import { LLMChain } from 'langchain/chains'
// import { initializeAgentExecutor } from 'langchain/agents'
//
// const model = new OpenAI({
//   temperature: 0,
//   openAIApiKey: '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',
// })
// const tools = [new Calculator()]
//
// const prefix = `Answer the following questions as best you can, but speaking as a pirate might speak. You have access to the following tools:`
// const suffix = `Begin! Remember to speak as a pirate when giving your final answer. Use lots of "Args"
//
// Question: {input}
// {agent_scratchpad}`
//
// const createPromptArgs = {
//   suffix,
//   prefix,
//   inputVariables: ['input', 'agent_scratchpad'],
// }
//
// const prompt = ZeroShotAgent.createPrompt(tools, createPromptArgs)
//
// const llmChain = new LLMChain({ llm: model, prompt })
//
// const agent = new ZeroShotAgent({
//   llmChain: llmChain,
//   allowedTools: ['calculator'],
// })
//
// const executor = await initializeAgentExecutor(
//   tools,
//   model,
//   'zero-shot-react-description',
//   true
// )
//
// console.log('Loaded agent.')
//
// const input = `Whats 1 + 3?`
//
// console.log(`Executing with input "${input}"...`)
//
// const result = await executor.call({ input })
// console.log(`Got Result ${Object.keys(result)}`)
// console.log(`Got output ${result.output}`)
