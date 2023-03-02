import { config } from 'dotenv-safe'

// Load the appropriate configuration file based on the environment.
config({ path: `.env.${process.env.NODE_ENV}` })
