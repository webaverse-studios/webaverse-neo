import SEA from 'gun/sea.js'
import { admin } from '#Admin'
import { gun } from '#Gun'


//noinspection JSCheckFunctionSignatures
const
  // Expire certs after 1 day.
  // TODO: Refresh certs before they expire and enable this.
  //oneDay = 24 * 60 * 60 * 1000,
  //opts = { expiry: GUN.state() + oneDay },

  // Tables
  userTable = { '*': 'users', '+': '*' },

  certs = [
    // Allow each user to write to their own user table on the admin node.
    await SEA.certify( '*', [ userTable ], admin )
    //await SEA.certify( '*', [ userTable ], admin, null, opts )
  ]

// Apply all certificates to the admin node.
for ( const cert of certs ) {
  gun.user().get( 'certificate' ).put( cert )
}
