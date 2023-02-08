## Zarinpal payement and gateway API
Read more about how zarinpal API at https://www.zarinpal.com/docs/md/howToUse/

#### How to download
```sh
npm i zarinpal-nodejs
```

#### How to use
```js

async function transaction(){
  const Zarinpal = require("zarinpal-nodejs")

  const merchantID = "XXXX-XX-XXXX-XXXXX-XXXX"
  const zarinpal = new Zarinpal(merchantID)

  // currency by default is Toman
  const paymentResponse = await zarinpal.paymentRequest({
    amount: 1000,
    callback_url: "http://localhost:3000/api/payment",
    description: "a simple test",
  })

  // if creating payement transaction was no successfull the redirect url
  // will be an empty string
  const redirectURL = zarinpal.getRedirectURL(paymentResponse)
}

```

#### Check to see if the payment was successfull
```js
if(zarinpal.wasSuccessfull(paymentResponse)){
  // here payment was successfull
}
```

#### You can get the authority if the payment was successfull
and save it in db for later use and checks
> Note: if creating payement transaction was not successfull it will return undefined
```js
const authority = zarinpal.getAuthority(paymentResponse)
```

#### Now you redirect the user to this url 
- After user payed then you zarinpal will redirect the user to the callback_url
- In there you can find out the if the payment was successfull
```js
// here is in your callback_url api
const query =  req.query // for example in the express like apis where you have res,req objects
if(zarinpal.didUserPayedSuccessfully(query)){
  // successfull payment
}

```

#### Get the authority 
> Note: this will return `undefined` if user didnt pay successfull
```js
const authority = zarinpal.getAuthorityAfterSuccessfullPayment(query)
```

#### Make sure to verify 
if the payment was successfull in your callbakc_url api
otherwise after sometime the zarinpal will reject the amount back to the owner
```js
const verificationResponse = await zarinpal.verifyPayment({
  amount: 1000,
  authority
})
```

#### Utils for checking verification response
- To check if verify was successfull
```js 
const ok = zarinpal.wasVerifySuccessfull(verificationResponse)
```

- For getting masked card number
```js
const maskedCardNumber = zarinpal.getMaskedCardPan(verificationResponse)
```

- For getting the ref id `the code that user can use to track the transaction`
```js
const refID = zarinpal.getRefID(verificationResponse)
```

- For getting the fee that this amount should pay to zarinpal
> Note: As of now zarinpal takes 1% to the amount of 3000 toman from each successfull transaction
```js
const fee = zarinpal.getFee(verificationResponse)
```

#### Get all the unverified paymenets
```js
const unverifiedRequests = await getAllUnverifiedRequests()
```

#### Refund the amount to the owner
> NOTE: for using refund you should first request an access token from zarinpal website
```js
const refundResponse = await refund({
  authority
})

if(zarinpal.wasSuccessfull(refundResponse)){
  // refund was successfull
}
```