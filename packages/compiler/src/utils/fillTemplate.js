/**
 * Fill a template string with variables
 *
 * @param {string} templateString the template string
 * @param {any[]} templateVars the template variables
 * @returns {string} the filled template
 */
export const fillTemplate = function ( templateString, templateVars ) {
  return new Function( 'return `' + templateString + '`;' ).call( templateVars )
}
