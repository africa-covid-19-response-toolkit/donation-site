# Donation Site

Fully built donation site using Stripe. This is a fork of the [Stripe Card Payment using React](https://github.com/stripe-samples/react-elements-card-payment) project.

## How to run locally

To run this sample locally you need to start both a local dev server for the `front-end` and another server for the `back-end`.

You will need a Stripe account with its own set of [API keys](https://stripe.com/docs/development#api-keys).

Follow the steps below to run locally.

**Installing and cloning manually**

If you do not want to use the Stripe CLI, you can manually clone and configure the sample yourself:

```
git clone https://github.com/africa-covid-19-response-toolkit/donation-site.git
```

Copy the .env.example file into a file named .env in the folder of the server you want to use. For example:

```
cp .env.example server/aws/.env
```

You will need a Stripe account in order to run the demo. Once you set up your account, go to the Stripe [developer dashboard](https://stripe.com/docs/development#api-keys) to find your API keys.

```
S3_BUCKET=<replace-with-your-publishable-key>
STRIPE_PUBLISHABLE_KEY=<replace-with-your-publishable-key>
STRIPE_SECRET_KEY=<replace-with-your-secret-key>
```

### Running both API and React client together

1. Go to `/donation-site`
2. Run `yarn`
3. Run `yarn start` and your default browser should now open with the front-end being served from `http://localhost:3001/` and the API will be served from `http://localhost:3000/`.

## OR run manually

### Running the API server

1. Go to `/server/aws`
2. Run `yarn`
3. Run `yarn server` and the API will be served from `http://localhost:3000/`.

### Running the React client

1. Go to `/client`
2. Run `yarn`
3. Run `yarn start` and your default browser should now open with the front-end being served from `http://localhost:3000/`.

### Using the sample app

When running both servers, you are now ready to use the app running in [http://localhost:3001](http://localhost:3001).

1. Enter your name and card details
2. Hit "Pay"
3. 🎉
