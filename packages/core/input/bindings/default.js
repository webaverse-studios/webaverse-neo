import { commands as c } from '../commands.js'


export const defaultBindings = {
  [ c.ATTACK        ]: [ 'KeyE', 'Mouse0'     ],
  [ c.JUMP          ]: [ 'Space'              ],
  [ c.MOVE_BACKWARD ]: [ 'KeyS', 'ArrowDown'  ],
  [ c.MOVE_FORWARD  ]: [ 'KeyW', 'ArrowUp'    ],
  [ c.MOVE_LEFT     ]: [ 'KeyA', 'ArrowLeft'  ],
  [ c.MOVE_RIGHT    ]: [ 'KeyD', 'ArrowRight' ],
}
