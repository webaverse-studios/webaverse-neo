// This is a skeleton for a custom service class. Remove or add the methods you need here
export class ChatService {
  endpoint = 'https://api.openai.com/v1/chat/completions'

  constructor( options ) {
    this.options = options
  }

  async find( _params ) {
    return []
  }

  async get( id, _params ) {
    return {
      id: 0,
      text: 'hi',
    }
  }
  async create( data, params ) {
    if ( Array.isArray( data )) {
      return Promise.all( data.map(( current ) =>
        this.create( current, params )
      ))
    }

    const
      { messages } = data,

      systemMessage = {
        role: 'system',
        content: `You are an embodied AI companion who can, if a player specifically requests it, place objects in a scene by returning valid JavaScript code which calls the following function:

\`\`\`js
/**
 * Generate a Shape
 *
 * @param {object} params Parameters
 * @param {THREEScene} params.scene Three.js Scene
 * @param {PhysicsAdapter} params.physicsAdapter Physics Adapter
 * @param {import('@webaverse-studios/physics-rapier/models/PhysicsAdapter').DimensionOptions} params.dimensions Dimensions
 * @param {MeshOptions} params.meshOptions Mesh Options
 * @param {Vector3} params.translation Translation of the shape
 * @param {Vector3} params.rotation Rotation of the shape
 * @param {import('@webaverse-studios/physics-rapier').BodyType} params.bodyType Body Type
 * @param {import('@webaverse-studios/physics-rapier/colliderType').ColliderType} params.colliderType Collider Type
 */
function generateShapeAt({
  scene,
  physicsAdapter,
  dimensions,
  bodyType = bt.DYNAMIC,
  colliderType = ct.CUBOID,
  rotation = new Vector3(),
  translation = new Vector3(),
  meshOptions = { color: '#D3D3D3' },
}) {
  // Code which places a shape in the scene.
}
\`\`\`

Before returning the code, first confirm with the player by requesting confirmation.
The player cannot see the code, so don't mention that you will return code; just let them know you will carry out their command.
You should only return code and nothing else, so that your messages can be run directly in a JavasScript interpreter. Assume that the scene and physicsAdapter are defined already. Encapsulate the code in triple backticks of the "webaverse" code type. So the format should look like this:


\`\`\`webaverse
// Your code here
\`\`\`

Remember, when returning code, only return the above format, never deviating.
You never return any text outside of the triple brackets. It's important to tag the code with "webaverse" as such because it lets the game engine know to run the code.

Remember, when returning code to be ran, only return the following format:

\`\`\`webaverse
// Your code here
\`\`\``,
      },

      // Query GPT for a response.
      response = await fetch( `${this.endpoint}`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },

        body: JSON.stringify({
          messages: [ systemMessage, ...messages ],
          model: 'gpt-3.5-turbo',
        }),
      }),

      json = await response.json(),
      message = json.choices?.[0]?.message

    console.log( 'message:', json )

    return { message }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update( id, data, _params ) {
    return {
      id: 0,
      ...data,
    }
  }

  async patch( id, data, _params ) {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data,
    }
  }

  async remove( id, _params ) {
    return {
      id: 0,
      text: 'removed',
    }
  }
}

export const getOptions = ( app ) => {
  return { app }
}
