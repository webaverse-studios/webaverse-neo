import { auth, createUser, getUserAccount } from '#Lib'


const
  { ADMIN_PASSWORD, ADMIN_USERNAME } = process.env,
  existingAccount = await getUserAccount( ADMIN_USERNAME )


export const
  // If an admin account already exists, authenticate it.
  // Otherwise, create a new admin account.
  admin = !existingAccount
    ? await createUser( ADMIN_USERNAME, ADMIN_PASSWORD )
    : await auth( ADMIN_USERNAME, ADMIN_PASSWORD )
