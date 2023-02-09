const isNotValid = require("./isNotValid")
const isTypeString = require("../isTypeString")
const isValid = require("./isValid")

function checkAuthority(authority) {
  if (!isTypeString(authority)) {
    return isNotValid("authority is not valid it should be a valid string", authority)
  }

  if (authority.length === 0) return isNotValid("authority is not valid it should be a non empty string", authority)

  return isValid()
}

module.exports = checkAuthority