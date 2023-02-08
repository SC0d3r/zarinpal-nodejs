export function isTypeNumber(x) {
  return typeof x === "number" && !isNaN(x) && Number.isInteger(x)
}

export function isTypeString(x) {
  return typeof x === "string"
}

function isValid() {
  return { status: true, reason: "" }
}

function isNotValid(...reasons) {
  return { status: false, reason: reasons.join(", ") }
}

export function checkAuthority(authority) {
  if (!isTypeString(authority)) {
    return isNotValid("authority is not valid it should be a valid string", authority)
  }

  if (authority.length === 0) return isNotValid("authority is not valid it should be a non empty string", authority)

  return isValid()
}

export function checkAmount(amount) {
  if (!isTypeNumber(amount)) {
    return isNotValid("Amount is not valid, it should be a valid number like 1000")
  }

  if (amount === 0) {
    return isNotValid("Amount is not valid, amount cannot be 0")
  }

  return isValid()
}

export function checkDescription(desc) {
  if (!isTypeString(desc)) {
    return isNotValid("description is not valid it should be of type string")
  }

  if (desc.length === 0) {
    return isNotValid("description is not valid it cannot be an empty string")
  }

  return isValid()
}

export function checkCallbackURL(callbackURL) {
  if (!isTypeString(callbackURL)) {
    return isNotValid("callback url is not valid it should be of type string", callbackURL)
  }

  if (callbackURL.length === 0) {
    return isNotValid("callback url is not valid it cannot be an empty string", callbackURL)
  }

  const urlRegex = /^((https?):\/\/)?([w|W]{3}\.)+[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/

  if (!urlRegex.test(callbackURL)) {
    return isNotValid("callback url is not valid it should be a valid url", callbackURL)
  }

  return isValid()
}