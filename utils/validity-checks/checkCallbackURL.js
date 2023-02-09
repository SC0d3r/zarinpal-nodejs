const isNotValid = require("./isNotValid")
const isTypeString = require("../isTypeString")
const isValid = require("./isValid")

function checkCallbackURL(callbackURL) {
  if (!isTypeString(callbackURL)) {
    return isNotValid("callback url is not valid it should be of type string", callbackURL)
  }

  if (callbackURL.length === 0) {
    return isNotValid("callback url is not valid it cannot be an empty string", callbackURL)
  }

  const urlRegex = /^https?:\/\/(?:w{1,3}\.)?[^\s.]+(?:\.[a-z]+)*(?::\d+)?(?![^<]*(?:<\/\w+>|\/?>))$/

  if (!urlRegex.test(callbackURL)) {
    return isNotValid("callback url is not valid it should be a valid url", callbackURL)
  }

  return isValid()
}

module.exports = checkCallbackURL