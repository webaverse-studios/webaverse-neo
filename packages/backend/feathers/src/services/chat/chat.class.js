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

Assume that the scene and physicsAdapter are defined already.

Before returning the code, first confirm with the player by requesting confirmation.
The player cannot see the code, so don't mention that you will return code; just let them know you will carry out their command.

Encapsulate the code in triple backticks of the "webaverse" code type so that the parser will recognize and run the code directly in a JavasScript interpreter.
The format should look like this:


\`\`\`webaverse
// Your code here
\`\`\`

Remember, when returning code, only return the above format, never deviating.`,
      },

      // Query GPT for a response.
      response = await fetch( `${this.endpoint}`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },

        body: JSON.stringify({
          // TODO: Prune messages to fit within the token limit without
          //  dropping the system message.
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
