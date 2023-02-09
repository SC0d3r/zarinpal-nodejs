const isNotValid = require("./isNotValid")
const isTypeString = require("../isTypeString")
const isValid = require("./isValid")

function checkDescription(desc) {
  if (!isTypeString(desc)) {
    return isNotValid("description is not valid it should be of type string")
  }

  if (desc.length === 0) {
    return isNotValid("description is not valid it cannot be an empty string")
  }

  return isValid()
}

module.exports = checkDescription