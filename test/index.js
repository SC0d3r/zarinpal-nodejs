const Zarinpal = require("../Zarinpal.js")

async function main() {
  const zarinpal = new Zarinpal("1344b5d4-0048-11e8-94db-005056a205be")

  try {

    const resp = await zarinpal.paymentRequest({
      amount: 1000,
      callback_url: "http://localhost:3000/api/payment",
      description: "a simple test",
    })

    if (zarinpal.wasSuccessfull(resp)) {
      console.log("redirect url", zarinpal.getRedirectURL(resp))
    } else {
      console.log("Translated error to farsi", zarinpal.translateError(resp))
    }

    // const allUnverifiedRequests = await zarinpal.getAllUnverifiedRequests()
    // console.log("get all unverfied requests", allUnverifiedRequests?.data?.authorities)

  } catch (e) {
    const { request, ...rest } = e
    console.log("::ERROR while trying to requet payment", e)
  }

}

main()