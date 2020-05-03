import React, { useEffect, useState } from "react";
import { CardElement, PaymentRequestButtonElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./CheckoutForm.css";
import api from "../api";

const CURRENCIES = [
  { code: 'usd', symbol: '$' },
  { code: 'eur', symbol: '€' }
];
const DEFAULT_CURRENCY = "usd";

const AMOUNTS = [30,100,365,1000,5000,10000];
const DEFAULT_AMOUNT = 100;

export default function CheckoutForm() {
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [showCustomAmount, setShowCustomAmount] = useState(false)
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

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
    // api
    //   .createPaymentIntent({
    //     payment_method_types: ["card"],
    //     currency,
    //     amount: amount * 100
    //   })
    //   .then(clientSecret => {
    //     setClientSecret(clientSecret);
    //   })
    //   .catch(err => {
    //     setError(err.message);
    //   });

      if (stripe) {

        const paymentRequest = stripe.paymentRequest({
          country: 'US',
          currency: currency,
          total: {
            label: 'Demo total',
            amount: amount * 100,
          },
          requestPayerName: true,
          requestPayerEmail: true,
        });

        // Check the availability of the Payment Request API first.
        paymentRequest.canMakePayment().then(result => {
          console.log('can make paymentRequest', paymentRequest, result);

          if (result) {
            setPaymentRequest(paymentRequest);
          }
        });
      }
  }, [stripe, currency, amount]);

  useEffect(() => {
    if (paymentRequest) {
      console.log('init paymentmethod event');
      paymentRequest.on('paymentmethod', async (ev) => {
        ev.preventDefault();
        setProcessing(true);

        // Step 3: Use clientSecret from PaymentIntent and the CardElement
        // to confirm payment with stripe.confirmCardPayment()
        const payload = await stripe.confirmCardPayment(
          clientSecret,
          { paymentmethod: ev.paymentMethod.id },
          {handleActions: false}
          // payment_method: {
          //   card: elements.getElement(CardElement),
          //   billing_details: {
          //     name: ev.target.name.value
          //   }
          // }
        );

        if (payload.error) {
          setError(`Payment failed: ${payload.error.message}`);
          setProcessing(false);
          console.log("[error]", payload.error);
        } else {
          setError(null);
          setSucceeded(true);
          setProcessing(false);
          setMetadata(payload.paymentIntent);
          console.log("[PaymentIntent]", payload.paymentIntent);
        }
      });
    }
  }, [paymentRequest]);

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

  const renderFormField = (label, type, id, placeholder) => {
    // <label for={id}>{label}</label>
    return (
      <div className="form-group">
        <input
          type={type}
          className="form-control"
          id={id}
          placeholder={label}
          autoComplete={id}
        />
      </div>
    )
  }

  const renderDropdown = (label, display, choices) => {
    return (
      <div className="mt-0 mb-3">
        <label className="m-0">Select Amount</label>
        <div className="dropdown mt-0">
          <button className="btn btn-primary dropdown-toggle mt-0" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {display}
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {choices.map((choice, idx) => (
              <a className="dropdown-item" onClick={choice.onClick} key={idx}>{choice.display}</a>
            ))}
          </div>
        </div>
      </div>
    )
  };

  const currencyHandler = currencyCode => () => {
    setCurrency(currencyCode)
  }

  const renderCurrencySelector = () => {
    const currentCurrency = CURRENCIES.find(c => c.code === currency);
    const display = `${currentCurrency.symbol} ${currentCurrency.code}`;
    const choices = CURRENCIES.map(c => {
      const display = `${c.code} ${c.symbol}`;
      const onClick = currencyHandler(c.code)
      return { display, onClick };
    });

    return renderDropdown('Select Currency', display, choices);
  }

  const amountHandler = amountChoice => () => {
    setAmount(amountChoice);
    setShowCustomAmount(false);
  }

  const otherAmountHandler = () => {
    setShowCustomAmount(true)
  }

  const handleCustomAmount = (e) => {
    const customAmount = e.target.value;
    setAmount(customAmount);
  }

  const renderCustomAmountField = () => {
    return (
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          id="custom-amount"
          placeholder="Custom amount"
          onChange={handleCustomAmount}
        />
      </div>
    )
  }

  const renderAmountSelector = () => {
    const currentCurrency = CURRENCIES.find(c => c.code === currency);
    const display = showCustomAmount ? 'Custom Amount' : `${currentCurrency.symbol} ${amount}`;
    const choices = AMOUNTS.map(a => {
      const display = `${currentCurrency.symbol} ${a}`;
      const onClick = amountHandler(a)
      return { display, onClick };
    });
    choices.push({ display: 'Custom amount', onClick: otherAmountHandler })

    return (
      <div>
        {renderDropdown('Select Amount', display, choices)}
        {showCustomAmount && (
          renderCustomAmountField()
        )}
      </div>
    )
  }

  const renderDonationAmount = () => {
    return (
      <div>
        <h1>
          {currency.toLocaleUpperCase()}{" "}
          {amount.toLocaleString(navigator.language, {
            minimumFractionDigits: 2
          })}{" "}
        </h1>
      </div>
    );
  }

  const renderPersonalInformationForm = () => {
    return (
      <div>
        <h5>Personal Information</h5>
        {renderFormField('Name', 'text', 'name')}
        {renderFormField('Email', 'email', 'email')}
        {renderFormField('Comments', 'text', 'comments')}
      </div>
    )
  }

  const renderCreditCardForm = () => {
    const options = {
      style: {
        base: {
          color: "#32325d",
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#aab7c4"
          }
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a"
        }
      }
    };

    return (
      <div className="mb-4">
        <h5>Credit Card Information</h5>
        <CardElement
          className="sr-input sr-card-element"
          options={options}
        />
      </div>
    );
  }

  // <button
  //   className="btn btn-success"
  //   disabled={processing || !clientSecret || !stripe}
  // >
  //   {processing ? "Processing…" : "Pay"}
  // </button>

  const renderForm = () => {
    // className="sr-combo-inputs"
    console.log('paymentRequest', paymentRequest)
    return (
      <form>
        <h3>Donation Form</h3>

        <div>
          {renderCurrencySelector()}
          {renderAmountSelector()}
          {renderPersonalInformationForm()}
          {renderCreditCardForm()}
          {renderDonationAmount()}

          {error && <div className="message sr-field-error">{error}</div>}

          { paymentRequest && (<PaymentRequestButtonElement options={{paymentRequest}} />) }

        </div>
      </form>
    );
  };

  return (
    <div className="checkout-form">
      <div className="sr-payment-form">
        <div className="sr-form-row" />
        {succeeded ? renderSuccess() : renderForm()}
      </div>
    </div>
  );
}
