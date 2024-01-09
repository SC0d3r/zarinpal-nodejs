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

  // this will matches every url which starts with http or https
  // and also matches http://localhost:3000 
  const urlRegex = /^https?:\/\/\w+(?:\.\w+)*(?::[0-9]+)?\/?(?:\/[.\w]*)*(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)?$/

  if (!urlRegex.test(callbackURL)) {
    return isNotValid("callback url is not valid it should be a valid url", callbackURL)
  }

  return isValid()
}

module.exports = checkCallbackURL