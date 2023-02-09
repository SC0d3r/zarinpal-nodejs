function isTypeNumber(x) {
  return typeof x === "number" && !isNaN(x) && Number.isInteger(x)
}

module.exports = isTypeNumber