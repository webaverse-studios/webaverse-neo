import { DynamicTool } from 'langchain/tools'

const tools = [
  new DynamicTool({
    name: 'Move',
    description:
      'Useful when you want to move through the space. The input should be three numbers separated by commas (x,y,z).',
    func: (input) => {
      const [x, y, z] = input.split(',').map((x) => parseInt(x))
      if (isNaN(x) || isNaN(y) || isNaN(z)) {
        return 'Invalid input'
      }
      return `Moved to (${x}, ${y}, ${z})`
    },
  }),
  new DynamicTool({
    name: 'Rotate',
    description:
      'Useful when you want to rotate. The input should be one number which should be the degrees you want to rotate by.',
    func: (input) => {
      const degrees = parseInt(input)
      if (isNaN(degrees)) {
        return 'Invalid input'
      }
      return `Rotated by ${degrees} degrees`
    },
  }),
  new DynamicTool({
    name: 'Pick Up',
    description:
      'Useful when you are close to an object and you want to pick it up. The input should be the name of the object.',
    func: (input) => {
      return `Picked up ${input}`
    },
  }),
]

export default tools
