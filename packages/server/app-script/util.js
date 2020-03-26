/**
 * Lowercases the first character of the given string. If the argument is not
 * a string, the argument is returned unmodified.
 *
 * @param {string} name - String to be modified.
 * @return {string} New string with lowercased first letter.
 */
function lowerFirstCharacter(name) {
  return typeof name == "string"
    ? name.charAt(0).toLowerCase() + name.slice(1)
    : name;
}
