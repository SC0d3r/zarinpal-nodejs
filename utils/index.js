const checkAmount = require("./validity-checks/checkAmount");
const checkDescription = require("./validity-checks/checkDescription");
const checkCallbackURL = require("./validity-checks/checkCallbackURL");
const checkAuthority = require("./validity-checks/checkAuthority");

const isTypeNumber = require("./isTypeNumber");
const isTypeString = require("./isTypeString");

module.exports = {
  checkCallbackURL,
  checkDescription,
  checkAmount,
  checkAuthority,

  isTypeNumber,
  isTypeString,
}