import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button } from '@material-ui/core';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import ReCAPTCHA from 'react-google-recaptcha';
import { isEmpty } from 'lodash';
import config from '../constants/config';
import { renderFormField } from './forms/forms-util';

import './CheckoutForm.css';
import { payments } from '../api/stripe/';
import { COMMON_FIELDS } from '../constants/common-fields';
import CheckoutFormInitialState from './CheckOutFormInitialState';

const CheckoutForm = ({ langCode, lang }) => {
  const TEST_SITE_KEY = config.captchaKey;
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();

  const elements = useElements();
  const [captchaText, setCaptchaText] = useState('');
  const [isCaptchaExpired, setCaptchaExpiry] = useState(false);
  const [cardIsValid, setCardIsValid] = useState(false);

  const [formValues, setFormValues] = useState({
    ...CheckoutFormInitialState,
  });
  const [clear, setClear] = useState(0);

  const handleFieldChange = field => value => {
    setFormValues({
      ...formValues,
      [field]: value,
    });
  };

  const fields = COMMON_FIELDS(lang, handleFieldChange, langCode);

  useEffect(() => {
    if (elements) {
      console.log('set card change');
      const cardElement = elements.getElement(CardElement);
      cardElement.on('change', function(event) {
        console.log('card element', cardIsValid, event);
        if (event.complete) {
          console.log('complete');
          setCardIsValid(true);
        } else {
          console.log('incomplete');
          setCardIsValid(false);
        }
      });
    }
  }, [elements]);

  useEffect(() => {
    // Create PaymentIntent over Stripe API
    const amount =
      formValues.donationAmount === 'Other'
        ? formValues.customAmount
        : formValues.donationAmount;

    payments
      .createPaymentIntent({
        payment_method_types: ['card'],
        currency: formValues.currency,
        amount: amount * 100,
      })
      .then(clientSecret => {
        setClientSecret(clientSecret);
      })
      .catch(err => {
        setError(err.message);
      });
  }, []);

  const handleSubmit = async ev => {
    ev.preventDefault();
    setProcessing(true);

    // Step 3: Use clientSecret from PaymentIntent and the CardElement
    // to confirm payment with stripe.confirmCardPayment()
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: formValues.name,
        },
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
      // console.log("[error]", payload.error);
    } else {
      setError(null);
      setSucceeded(true);
      setProcessing(false);
      setMetadata(payload.paymentIntent);
      setFormValues({});
      setClear(clear + 1);
      // console.log("[PaymentIntent]", payload.paymentIntent);
    }
  };

  const isFormValid = () => {
    let isValid = true;
    // let cardIsValid = true;

    if (!isEmpty(captchaText) && !isCaptchaExpired) {
      console.log('valudate', cardIsValid);
      fields.forEach(f => {
        if (f.onValidate && f.active) {
          isValid = isValid && f.onValidate(formValues[f.property]);
        }
      });
    } else {
      isValid = false;
    }
    return isValid && cardIsValid;
  };

  const onCaptchaChange = value => {
    setCaptchaText(value);

    if (value === null) {
      setCaptchaExpiry(true);
    }
  };

  const renderCaptcha = () => {
    return (
      <Box my={2}>
        <ReCAPTCHA
          style={{ paddingTop: 20 }}
          ref={React.createRef()}
          sitekey={TEST_SITE_KEY}
          onChange={onCaptchaChange}
        />
      </Box>
    );
  };

  const renderSuccess = () => {
    return (
      <Box>
        <h1>Thank your for making a donation.</h1>
        <Box mt={2}>
          <a href="https://www.ethiopiatrustfund.org/">
            <Typography>Go back to EDTF Homepage.</Typography>
          </a>
        </Box>
      </Box>
    );
  };
  const renderField = property => {
    const field = fields.find(f => f.property === property);
    if (!field) {
      return null;
    }
    if (formValues.donationAmount === 'Other') {
      field.active = true;
    }
    return (
      <Grid item xs={12} md={12}>
        {renderFormField(field, clear)}
      </Grid>
    );
  };

  const renderDonationAmount = () => {
    const amount =
      formValues.donationAmount === 'Other'
        ? formValues.customAmount
        : formValues.donationAmount;

    return (
      <Box fontWeight={700}>
        <h2>
          Donating:&nbsp;&nbsp;
          {formValues.currency.toLocaleUpperCase()}{' '}
          {amount.toLocaleString(navigator.language, {
            minimumFractionDigits: 2,
          })}{' '}
        </h2>
      </Box>
    );
  };

  const renderPersonalInformationForm = () => {
    return (
      <Grid container spacing={4}>
        {renderField('name')}
        {renderField('companyName')}
        {renderField('email')}
        {renderField('anonymousDonation')}
        {renderField('comment')}
      </Grid>
    );
  };

  const renderCreditCardForm = () => {
    const options = {
      style: {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a',
        },
      },
    };

    return (
      <Box mb={3}>
        <CardElement className="sr-input sr-card-element" options={options} />
      </Box>
    );
  };

  const renderSectionHeader = (label, variant, bottomMargin) => {
    return (
      <Box mb={bottomMargin}>
        <Typography variant={variant}>{label}</Typography>
      </Box>
    );
  };

  const renderForm = () => {
    // className="sr-combo-inputs"
    return (
      <>
        {/* {renderSectionHeader('Donation Form', 'h3', 2)} */}
        {/* <Box mb={4}> */}
        <Grid container spacing={4}>
          {renderField('currency')}
          {renderField('donationAmount')}
          {formValues.donationAmount === 'Other'
            ? renderField('customAmount')
            : null}
        </Grid>
        {/* </Box> */}

        {/* {renderSectionHeader('Personal Information', 'h4', 2)} */}
        {/* <Box mb={2}> */}
        {renderPersonalInformationForm()}
        {/* </Box> */}

        {/* {renderSectionHeader('Payment Information', 'h4', 2)} */}

        {/* <Box mb={2}> */}
        {renderCreditCardForm()}
        {renderDonationAmount()}

        {error && <div className="message sr-field-error">{error}</div>}
        {/* </Box> */}
        {/* <Box mb={2} textAlign="right"> */}
        {renderCaptcha()}

        <Button
          variant="contained"
          color="primary"
          disabled={!isFormValid()}
          onClick={handleSubmit}
        >
          {' '}
          {processing ? 'Processing…' : 'Pay'}
        </Button>
        {/* </Box> */}
      </>
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
};
export default CheckoutForm;
