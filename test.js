const Zarinpal = require("./Zarinpal.js")
const ZarinpalCheckout = require('zarinpal-checkout');

async function main() {
  const zarinpal = new Zarinpal("1344b5d4-0048-11e8-94db-005056a205be", false)

  try {

    const resp = await zarinpal.paymentRequest({
      amount: 1000,
      callback_url: "http://localhost:3000/api/payment",
      description: "a simple test",
    })

    console.log("resp is", resp, resp.errors.validations)
    console.log("redirect url", zarinpal.getRedirectURL(resp))
    const allUnverifiedRequests = await zarinpal.getAllUnverifiedRequests()
    console.log("get all unverfied requests", allUnverifiedRequests?.data?.authorities)
  } catch (e) {
    const { request, ...rest } = e
    console.log("::ERROR while trying to requet payment", e)
  }

}

function main2() {
  const zarinpal = ZarinpalCheckout.create(Zarinpal.createRadnomMerchandID(), true)
  zarinpal.PaymentRequest({
    Amount: '1000', // In Tomans
    CallbackURL: 'https://your-safe-api/example/zarinpal/validate',
    Description: 'A Payment from Node.JS',
    Email: 'hi@siamak.work',
    Mobile: '09120000000'
  }).then(response => {
    if (response.status === 100) {
      console.log(response.url);
    } else {
      console.log('in else', response)
    }
  }).catch(err => {
    console.error(err);
  });
}

main()
// main2()