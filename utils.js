function isTypeNumber(x) {
  return typeof x === "number" && !isNaN(x) && Number.isInteger(x)
}

function isTypeString(x) {
  return typeof x === "string"
}

function isValid() {
  return { status: true, reason: "" }
}

function isNotValid(...reasons) {
  return { status: false, reason: reasons.join(", ") }
}

function checkAuthority(authority) {
  if (!isTypeString(authority)) {
    return isNotValid("authority is not valid it should be a valid string", authority)
  }

  if (authority.length === 0) return isNotValid("authority is not valid it should be a non empty string", authority)

  return isValid()
}

function checkAmount(amount) {
  if (!isTypeNumber(amount)) {
    return isNotValid("Amount is not valid, it should be a valid number like 1000")
  }

  if (amount === 0) {
    return isNotValid("Amount is not valid, amount cannot be 0")
  }

  return isValid()
}

function checkDescription(desc) {
  if (!isTypeString(desc)) {
    return isNotValid("description is not valid it should be of type string")
  }

  if (desc.length === 0) {
    return isNotValid("description is not valid it cannot be an empty string")
  }

  return isValid()
}

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

module.exports = {
  checkCallbackURL,
  checkDescription,
  checkAmount,
  checkAuthority,
  isTypeString,
  isTypeNumber,
}