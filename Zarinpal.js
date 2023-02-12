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

  /**
   * 
   * @param {string} merchantID A string with **`36`** chracters, get this code from *Zarinpal website*
   * @param {boolean} sandbox currently **`sandbox`** mode is **`disabled`** by Zarinpal
   */
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

  /**
   * #### Create a new payment request(`transaction`)
   * @param {{
   *    amount: Long,
   *    description: string,
   *    callback_url: string,
   *    metadata?: {mobile: string, email: string}
   *    mobile?: string,
   *    email?: string
   *    currency?: "IRT"|"IRR"
   *  }} argument 
   */
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

  /**
   * 
   * @param paymentRequest 
   * ```js
   * const paymentRequest = await zarin.paymentRequest({...})
   * ```
  */
  wasSuccessfull(paymentRequest) {
    return paymentRequest?.data?.code === 100
  }

  /**
   * #### Authority is the code you get when the paymentRequest is successfull 
   * @param paymentRequest
   * ```js
   * const paymentRequest = await zarin.paymentRequest({...})
   * ```
  */
  getAuthority(paymentRequest) {
    return paymentRequest?.data?.authority
  }

  /**
   * #### Redirect user to this URL for payment
   * @param paymentRequest 
   * ```js
   * const paymentRequest = await zarin.paymentRequest({...})
   * ```
  */
  getRedirectURL(paymentRequest) {
    if (!this.wasSuccessfull(paymentRequest)) return ""

    const authority = this.getAuthority(paymentRequest)
    return this.sandbox ?
      `https://sandbox.zarinpal.com/pg/StartPay/${authority}`
      :
      `https://www.zarinpal.com/pg/StartPay/${authority}`
  }

  /**
   * 
   * @param {{Status: "OK"|"NOK"}} query 
   * @deprecated use **`didUserPaySuccessfully`** method instead
   * > `Note:` this method will get deleted in the next version use `didUserPaySuccessfully` method instead
   */
  didUserPayedSuccessfully(query) {
    return query && query.Status === "OK"
  }

  /**
   * 
   * @param {{Status: "OK"|"NOK"}} query 
   */
  didUserPaySuccessfully(query) {
    return query && query.Status === "OK"
  }

  /**
   * 
   * @param {{Authority: string}} query 
   */
  getAuthorityAfterSuccessfullPayment(query) {
    return query && query.Authority
  }

  /**
   * #### Verify the payment in your api route(`callback_url`)
   * 
   * @param {{
   *   amount: Long
   *   authority: string 
   * }} argument
   * 
   * `Note:` If you dont verify a payment zarinpal will return the user's money after a certain period
   * 
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

  /**
   * #### Find out if verification was successfull 
   * @param  verifyResponse 
   * ```js
   * const verifyResponse = await zarin.verifyPayment({...})
   * ```
   */
  wasVerifySuccessfull(verifyResponse) {
    return (
      verifyResponse?.data?.code === 100 ||
      // code 101 means that this is the second time we are verifying this successfull payment
      verifyResponse?.data?.code === 101
    )
  }

  /**
   * #### Get masked card number `ex: 5434-****-****-3215`
   * @param  verifyResponse 
   * ```js
   * const verifyResponse = await zarin.verifyPayment({...})
   * ```
   */
  getMaskedCardPan(verifyResponse) {
    return verifyResponse?.data?.card_pan
  }

  /**
   * #### Get reference id of payment `ex: 23453135`
   * @param  verifyResponse 
   * ```js
   * const verifyResponse = await zarin.verifyPayment({...})
   * ```
   */
  getRefID(verifyResponse) {
    return verifyResponse?.data?.ref_id
  }

  /**
   * #### Get the fee that you/customer has payed for the payment amount `ex: 3000`
   * @param  verifyResponse 
   * ```js
   * const verifyResponse = await zarin.verifyPayment({...})
   * ```
   */
  getFee(verifyResponse) {
    return verifyResponse?.data?.fee
  }

  /**
   * #### Returns a list of previous unverified requests 
   */
  async getAllUnverifiedRequests() {
    const url = "https://api.zarinpal.com/pg/v4/payment/unVerified.json"

    const data = {
      merchant_id: this.merchantID,
    }

    return this.#send(url, data);
  }


  /**
   * #### translates error to farsi if its a predefined error
   * @param response 
   * ```js
   * const response = await zarin.paymentRequest({...})
   * ```
   * for list of predefined error please check https://www.zarinpal.com/docs/md/paymentGateway/errorList.html
   */
  translateError(response) {
    const errorCode = response?.errors?.code
    if (!isTypeNumber(errorCode)) return ""

    const maybeFarsiErrorMessage = ERRORS[errorCode.toString()]
    return maybeFarsiErrorMessage ?? ""
  }

  /**
   * @param {{authority: string}} argument
   * ##### `NOTE:` for using refund you should first request an access token 
   * from zarinpal website
   * ##### *This method is not tested yet*
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