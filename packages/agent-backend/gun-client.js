import Gun from "gun";
import "gun/lib/promise.js"


export const gun = Gun({peers: ['http://localhost:3401/gun']});

export const agents = gun.get('agents')
