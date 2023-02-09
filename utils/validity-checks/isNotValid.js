function isNotValid(...reasons) {
  return { status: false, reason: reasons.join(", ") }
}

module.exports = isNotValid