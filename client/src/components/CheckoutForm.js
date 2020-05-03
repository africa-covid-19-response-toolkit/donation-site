import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Button } from "@material-ui/core";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { renderFormField } from "./forms/forms-util";

import "./CheckoutForm.css";
import api from "../api";
import { COMMON_FIELDS } from "../constants/common-fields";
import CheckoutFormInitialState from "./CheckOutFormInitialState";
import languageStore from "../helpers/lang/language-store";
console.log(languageStore);

// const DEFAULT_CURRENCY = "USD";

// const DEFAULT_AMOUNT = 100;

export default function CheckoutForm() {
  const [amount, setAmount] = useState(CheckoutFormInitialState.donationAmount);
  const [currency, setCurrency] = useState(CheckoutFormInitialState.currency);
  //const [showCustomAmount, setShowCustomAmount] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  console.log(stripe);
  const elements = useElements();
  const [formValues, setFormValues] = useState({
    ...CheckoutFormInitialState,
  });
  const handleFieldChange = (field) => (value) => {
    if (field === "currency") {
      setCurrency(value);
    }
    if (field === "donationAmount") {
      setAmount(value);
    }
    setFormValues({
      ...formValues,
      [field]: value,
    });
  };
  const [clear, setClear] = useState(0);
  // TODO: This should move to a tope level
  const langCode = languageStore.langCode;
  const lang = languageStore.lang;
  const fields = COMMON_FIELDS(lang, handleFieldChange, langCode);

  useEffect(() => {
    // Step 1: Fetch product details such as amount and currency from
    // API to make sure it can't be tampered with in the client.
    // setCurrency(DEFAULT_CURRENCY);
    // setAmount(DEFAULT_AMOUNT);
    // api.getProductDetails().then(productDetails => {
    //   setAmount(productDetails.amount / 100);
    //   setCurrency(productDetails.currency);
    // });

    // Step 2: Create PaymentIntent over Stripe API
    api
      .createPaymentIntent({
        payment_method_types: ["card"],
        currency,
        amount: amount * 100,
      })
      .then((clientSecret) => {
        setClientSecret(clientSecret);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [currency, amount]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);
    console.log(formValues);

    // Step 3: Use clientSecret from PaymentIntent and the CardElement
    // to confirm payment with stripe.confirmCardPayment()
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: ev.target.name.value,
        },
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
      console.log("[error]", payload.error);
    } else {
      setError(null);
      setSucceeded(true);
      setProcessing(false);
      setMetadata(payload.paymentIntent);
      setFormValues({});
      setClear(clear + 1);
      console.log("[PaymentIntent]", payload.paymentIntent);
    }
  };

  const renderSuccess = () => {
    return (
      <div className="sr-field-success message">
        <h1>Your test payment succeeded</h1>
        <p>View PaymentIntent response:</p>
        <pre className="sr-callout">
          <code>{JSON.stringify(metadata, null, 2)}</code>
        </pre>
      </div>
    );
  };
  const renderFields = (property) => {
    console.log(property);
    const field = fields.find((f) => f.property === property);
    console.log(field);
    if (!field) {
      return null;
    }

    return renderFormField(field, clear);
  };

  // const renderDropdown = (label, display, choices) => {
  //   return (
  //     <div className="mt-0 mb-3">
  //       <label className="m-0">Select Amount</label>
  //       <div className="dropdown mt-0">
  //         <button
  //           className="btn btn-primary dropdown-toggle mt-0"
  //           type="button"
  //           id="dropdownMenuButton"
  //           data-toggle="dropdown"
  //           aria-haspopup="true"
  //           aria-expanded="false"
  //         >
  //           {display}
  //         </button>
  //         <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
  //           {choices.map((choice) => (
  //             <a className="dropdown-item" onClick={choice.onClick}>
  //               {choice.display}
  //             </a>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // const currencyHandler = (currencyCode) => () => {
  //   setCurrency(currencyCode);
  // };

  // const renderCurrencySelector = () => {
  //   const currentCurrency = CURRENCIES.find((c) => c.code === currency);
  //   const display = `${currentCurrency.symbol} ${currentCurrency.code}`;
  //   const choices = CURRENCIES.map((c) => {
  //     const display = `${c.code} ${c.symbol}`;
  //     const onClick = currencyHandler(c.code);
  //     return { display, onClick };
  //   });

  //   //return renderDropdown("Select Currency", display, choices);
  //   return renderFields("currency");
  // };

  // const amountHandler = (amountChoice) => () => {
  //   setAmount(amountChoice);
  //   setShowCustomAmount(false);
  // };

  // const otherAmountHandler = () => {
  //   setShowCustomAmount(true);
  // };

  // const handleCustomAmount = (e) => {
  //   const customAmount = e.target.value;
  //   setAmount(customAmount);
  // };

  // const renderAmountSelector = () => {
  //   const currentCurrency = CURRENCIES.find((c) => c.code === currency);
  //   const display = showCustomAmount
  //     ? "Custom Amount"
  //     : `${currentCurrency.symbol} ${amount}`;
  //   const choices = AMOUNTS.map((a) => {
  //     const display = `${currentCurrency.symbol} ${a}`;
  //     const onClick = amountHandler(a);
  //     return { display, onClick };
  //   });
  //   choices.push({ display: "Custom amount", onClick: otherAmountHandler });

  //   return (
  //     <div>{/* {renderDropdown("Select Amount", display, choices)} */}</div>
  //   );
  // };

  const renderDonationAmount = () => {
    return (
      <div>
        <h1>
          {currency.toLocaleUpperCase()}{" "}
          {amount.toLocaleString(navigator.language, {
            minimumFractionDigits: 2,
          })}{" "}
        </h1>
      </div>
    );
  };

  const renderPersonalInformationForm = () => {
    return (
      <div>
        <Grid container spacing={4}>
          {renderFields("firstName")}
          {renderFields("lastName")}
          {renderFields("companyName")}
          {renderFields("email")}
          {renderFields("anonymousDonation")}
          {renderFields("comment")}
        </Grid>
      </div>
    );
  };

  const renderCreditCardForm = () => {
    const options = {
      style: {
        base: {
          color: "#32325d",
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a",
        },
      },
    };

    return (
      <div className="mb-4">
        <CardElement className="sr-input sr-card-element" options={options} />
      </div>
    );
  };
  const renderSubsectionheader = (label) => {
    return (
      <Typography className="subsectionheader" variant="h5">
        {label}
      </Typography>
    );
  };
  const renderForm = () => {
    // className="sr-combo-inputs"
    return (
      <form onSubmit={handleSubmit}>
        {renderSubsectionheader("Donation Form")}
        <Grid container spacing={4}>
          {renderFields("currency")}
          {renderFields("donationAmount")}
          {formValues.donationAmount === "Other"
            ? renderFields("customAmount")
            : null}
        </Grid>
        {renderSubsectionheader("Personal Information")}
        <Grid container spacing={4}>
          {renderPersonalInformationForm("Personal Information")}
        </Grid>

        {renderSubsectionheader("Credit Card Information")}

        <Box mt={4}>
          {renderCreditCardForm()}
          <Grid container spacing={4}>
            {renderDonationAmount()}
            {error && <div className="message sr-field-error">{error}</div>}
          </Grid>
        </Box>
        <Box mt={4} textAlign="right">
          <Button
            className="btn btn-success"
            disabled={processing || !clientSecret || !stripe}
          >
            {" "}
            {processing ? "Processing…" : "Pay"}
          </Button>
        </Box>
      </form>
    );
  };

  return (
    <div className="checkout-form">
      <div className="sr-payment-form">
        <div className="sr-form-row" />
        <Box>{succeeded ? renderSuccess() : renderForm()}</Box>
      </div>
    </div>
  );
}
