import path from 'path'

/**
 * Get the current working directory
 *
 * @returns {string} the current working directory
 */
export function getCwd() {
  return path.resolve( process.cwd(), process.env.BASE_CWD ?? '' )
}
