const crypto = require("crypto");
const { Headers, default: fetch } = require("node-fetch")
const ERRORS = require("./enums/ERRORS.json")

const {
  checkAmount,
  checkCallbackURL,
  checkDescription,
  isTypeNumber,
  isTypeString,
  checkAuthority,
} = require("./utils")

class Zarinpal {
  constructor(merchantID, sandbox = false) {
    if (!isTypeString(merchantID)) {
      throw new Error(":: ARGUMENT ERROR merchantID should be of type string")
    }

    if (merchantID.length !== 36) {
      throw new Error(":: ARGUMENT ERROR merchantID should be 36 characters long")
    }

    if (!!sandbox) {
      throw new Error(":: Zarinpal has disabled the sandbox mode you cannot use that until they enable it gain")
    }

    this.sandbox = !!sandbox
    this.merchantID = merchantID
  }

  static createRadnomMerchandID() {
    // this will create a random 36 characters string
    // every byte adds 2 hex values
    return crypto.randomBytes(18).toString("hex");
  }

  async paymentRequest({
    amount,
    description,
    callback_url,
    metadata,
    mobile,
    email,
    currency = "IRT" // it also can be "IRR"
  }) {
    const url = this.sandbox ? "https://sandbox.zarinpal.com/pg/v4/payment/request.json"
      :
      "https://api.zarinpal.com/pg/v4/payment/request.json"

    const amountValidity = checkAmount(amount)
    if (!amountValidity.status) {
      throw new Error(amountValidity.reason)
    }

    const descriptionValidity = checkDescription(description)
    if (!descriptionValidity.status) {
      throw new Error(descriptionValidity.reason)
    }

    const callback_urlValidity = checkCallbackURL(callback_url)
    if (!callback_urlValidity.status) {
      throw new Error(callback_urlValidity.reason)
    }

    if (currency !== "IRR" && currency !== "IRT") {
      throw new Error("Currency is not valid it can be either 'IRR' for rial or 'IRT' for toman, currency" + currency)
    }

    const data = {
      merchant_id: this.merchantID,
      amount,
      description,
      currency,
      callback_url,
      metadata,
      mobile,
      email,
    }

    return this.#send(url, data);
  }

  async #send(url, data) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    try {

      const response = await fetch(url, {
        method: 'post',
        body: JSON.stringify(data),
        headers,
      });

      // console.log("response is", response)
      return await response.json()
    } catch (e) {
      console.log("::ERROR while trying to send", url, data, e)
    }
  }

  wasSuccessfull(paymentRequest) {
    return paymentRequest?.data?.code === 100
  }

  getAuthority(paymentRequest) {
    return paymentRequest?.data?.authority
  }

  getRedirectURL(paymentRequest) {
    if (!this.wasSuccessfull(paymentRequest)) return ""

    const authority = this.getAuthority(paymentRequest)
    return this.sandbox ?
      `https://sandbox.zarinpal.com/pg/StartPay/${authority}`
      :
      `https://www.zarinpal.com/pg/StartPay/${authority}`
  }

  didUserPayedSuccessfully(query) {
    return query && query.Status === "OK"
  }

  getAuthorityAfterSuccessfullPayment(query) {
    return query && query.Authority
  }

  /**
   * 
   * Note: if you dont verify a payment zarinpal will
   * return the user's money after a certain period
   */
  async verifyPayment({
    amount,
    authority,
  }) {
    const url = this.sandbox ?
      "https://sandbox.zarinpal.com/pg/v4/payment/verify.json"
      :
      "https://api.zarinpal.com/pg/v4/payment/verify.json"


    const amountValidity = checkAmount(amount)
    if (!amountValidity.status) {
      throw new Error(amountValidity.reason)
    }

    const authorityValidity = checkAuthority(authority)
    if (!authorityValidity.status) {
      throw new Error(authorityValidity.reason)
    }

    const data = {
      merchant_id: this.merchantID,
      amount,
      authority,
    }

    return this.#send(url, data);
  }

  wasVerifySuccessfull(verifyResponse) {
    return (
      verifyResponse?.data?.code === 100 ||
      // code 101 means that this is the second time we are verifying this successfull payment
      verifyResponse?.data?.code === 101
    )
  }

  getMaskedCardPan(verifyResponse) {
    return verifyResponse?.data?.card_pan
  }

  getRefID(verifyResponse) {
    return verifyResponse?.data?.ref_id
  }

  getFee(verifyResponse) {
    return verifyResponse?.data?.fee
  }

  async getAllUnverifiedRequests() {
    const url = "https://api.zarinpal.com/pg/v4/payment/unVerified.json"

    const data = {
      merchant_id: this.merchantID,
    }

    return this.#send(url, data);
  }


  /**
   * 
   * translates error to farsi if its a predefined error
   * for list of predefined error please check https://www.zarinpal.com/docs/md/paymentGateway/errorList.html
   */
  translateError(response) {
    const errorCode = response?.errors?.code
    if (!isTypeNumber(errorCode)) return ""

    const maybeFarsiErrorMessage = ERRORS[errorCode.toString()]
    return maybeFarsiErrorMessage ?? ""
  }

  /**
   * 
   * NOTE: for using refund you should first request an access token 
   * from zarinpal website
   */
  async refund({
    authority,
  }) {
    const url = "https://api.zarinpal.com/pg/v4/payment/refund.json"

    const authorityValidity = checkAuthority(authority)
    if (!authorityValidity.status) {
      throw new Error(authorityValidity.reason)
    }

    const data = {
      merchant_id: this.merchantID,
      authority,
    }

    return this.#send(url, data);
  }
}

module.exports = Zarinpal