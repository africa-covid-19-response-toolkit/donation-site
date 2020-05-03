"use strict";

const stripePubKey = process.env.STRIPE_PUBLISHABLE_KEY;
const stripeSecKey = process.env.STRIPE_SECRET_KEY;

module.exports.handler = async (event, context, callback) => {
  const {
    pathParameters: { type },
  } = event;
  return home(event);
};

module.exports.response = async (event, context, callback) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event,
        environment: stripeSecKey,
      },
      null,
      2
    ),
  };
};

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


module.exports.webhook = async (event, context, callback) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed.`);
      return response.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "payment_intent.succeeded") {
    // Fulfill any orders, e-mail receipts, etc
    console.log("💰 Payment received!");
  }

  if (eventType === "payment_intent.payment_failed") {
    // Notify the customer that their order was not fulfilled
    console.log("❌ Payment failed.");
  }

  response.sendStatus(200);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.createPayment = async (event, context, callback) => {
  const body = req.body;
  // const { currency, amount } = body;

  // const productDetails = getProductDetails();

  const options = {
    ...body
  };

  try {
    const paymentIntent = await stripe.paymentIntents.create(options);
    response.json(paymentIntent);
  } catch (err) {
    response.json(err);
  }
};

module.exports.getPubicKey = async (event, context, callback) => {
  response.send({ publicKey: process.env.STRIPE_PUBLISHABLE_KEY });
};

module.exports.home = async (event, context, callback) => {
  response.send(event);
};