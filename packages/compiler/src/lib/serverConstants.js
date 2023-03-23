import { tryReadFile } from '../utils/tryReadFile.js'

export const SERVER_CERTS = {
  key:
    tryReadFile( './certs/privkey.pem' ) ||
    tryReadFile( './certs-local/privkey.pem' ),
  cert:
    tryReadFile( './certs/fullchain.pem' ) ||
    tryReadFile( './certs-local/fullchain.pem' ),
}

export const SERVER_NAME = `local-compiler.webaverse.com`
export const SERVER_PORT = parseInt( process.env.PORT, 10 ) || 443
