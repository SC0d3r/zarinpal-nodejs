const isNotValid = require("./isNotValid")
const isTypeNumber = require("../isTypeNumber")
const isValid = require("./isValid")

function checkAmount(amount) {
  if (!isTypeNumber(amount)) {
    return isNotValid("Amount is not valid, it should be a valid number like 1000")
  }

  if (amount === 0) {
    return isNotValid("Amount is not valid, amount cannot be 0")
  }

  return isValid()
}

module.exports = checkAmount