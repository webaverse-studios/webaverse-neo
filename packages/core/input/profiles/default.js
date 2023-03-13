import * as a from '../actions/index.js'
import { defaultBindings as b } from '../bindings/index.js'
import { commands as c } from '../commands.js'


export const defaultProfile = [
  [ c.ATTACK       , b[ c.ATTACK        ], a.attack       ],
  [ c.JUMP         , b[ c.JUMP          ], a.jump         ],
  [ c.MOVE_FORWARD , b[ c.MOVE_FORWARD  ], a.moveForward  ],
  [ c.MOVE_BACKWARD, b[ c.MOVE_BACKWARD ], a.moveBackward ],
  [ c.MOVE_LEFT    , b[ c.MOVE_LEFT     ], a.moveLeft     ],
  [ c.MOVE_RIGHT   , b[ c.MOVE_RIGHT    ], a.moveRight    ],
]
