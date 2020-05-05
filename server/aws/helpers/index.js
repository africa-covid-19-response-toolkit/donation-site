const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


module.exports.receiveWebHook = (headers, rawBody, body) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed.`);
      throw new Error(`Webhook signature verification failed.`)      
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = body.data;
    eventType = body.type;
  }

  if (eventType === "payment_intent.succeeded") {

    // Write to DynamoDB
    // Send success email to user
    // Fulfill any orders, e-mail receipts, etc
    console.log("💰 Payment received!");
  }

  if (eventType === "payment_intent.payment_failed") {
    // Write to DynamoDB
    // Send failed email to user
    // Notify the customer that their order was not fulfilled
    console.log("❌ Payment failed.");
  }
}

module.exports.createPaymentIntent = (body) => {
  const options = {
    ...body
  };

  return stripe.paymentIntents.create(options);    
  
}

module.exports.getPublicKey = () => {
  return { publicKey: process.env.STRIPE_PUBLISHABLE_KEY };
}

module.exports.handleResponse = (callback, body, statusCode = 200) => {
  const response = {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
  };
  callback(null, response);
  return;
};

module.exports.handleError = (callback, name, error = '') => {
  console.error(error.message);
  const response = {
    statusCode: error.statusCode || 500,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      message: error.message || 'Something went wrong.',
    }),
  };
  if (!name && error.name) name = error.name;

  switch (name) {
    case 'noModelFound':
      response.body = JSON.stringify({
        message: error.message || 'Unknown type provided.',
      });
      break;
    case 'ValidationError':
      response.body = JSON.stringify({
        message: error.message || 'Validation error occurred.',
      });
      break;
    case 'MongoParseError':
      response.body = JSON.stringify({
        message: error.message || 'Unable to connect to database.',
      });
      break;
    default:
      break;
  }
  callback(null, response);
};
