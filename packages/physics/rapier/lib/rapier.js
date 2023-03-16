import RAPIER from '@dimforge/rapier3d-compat'

/**
 * Get the Rapier instance
 *
 * @returns {Promise<RAPIER>} Rapier instance
 */
export function getRapier() {
  return RAPIER.init().then(() => RAPIER )
}
