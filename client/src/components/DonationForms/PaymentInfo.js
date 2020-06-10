import React, { useEffect, useState, useMemo } from 'react';
import { Box, Grid, Typography, Button } from '@material-ui/core';
import GridContainer from 'shared/Grid/GridContainer.js';
import GridItem from 'shared/Grid/GridItem.js';

// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from '@stripe/react-stripe-js';

import ReCAPTCHA from 'react-google-recaptcha';
import { isEmpty } from 'lodash';
import config from '../../constants/config';
import { renderFormField } from '../forms/forms-util';

// import '../PaymentInfo.css';
import { payments } from '../../api/stripe';
import { COMMON_FIELDS } from '../../constants/common-fields';
import PaymentInfoInitialState from '../CheckOutFormInitialState';

import languageStore from '../../helpers/lang/language-store';

const useOptions = () => {
  // const fontSize = useResponsiveFontSize();
  const options = useMemo(
    () => ({
      style: {
        base: {
          // fontSize,
          color: '#424770',
          letterSpacing: '0.025em',
          fontFamily: 'Source Code Pro, monospace',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      },
    })
    // [fontSize]
  );

  return options;
};

const PaymentInfo = () => {
  const { langCode, lang } = languageStore;

  const TEST_SITE_KEY = config.captchaKey;
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();

  const [captchaText, setCaptchaText] = useState('');
  const [isCaptchaExpired, setCaptchaExpiry] = useState(false);
  const [cardIsValid, setCardIsValid] = useState(false);

  const [formValues, setFormValues] = useState({
    ...PaymentInfoInitialState,
  });
  const [clear, setClear] = useState(0);

  const handleFieldChange = field => value => {
    setFormValues({
      ...formValues,
      [field]: value,
    });
  };

  const fields = COMMON_FIELDS(lang, handleFieldChange, langCode);

  // useEffect(() => {
  //   if (elements) {
  //     console.log('set card change');
  //     const cardElement = elements.getElement(CardElement);
  //     cardElement.on('change', function(event) {
  //       console.log('card element', cardIsValid, event);
  //       if (event.complete) {
  //         console.log('complete');
  //         setCardIsValid(true);
  //       } else {
  //         console.log('incomplete');
  //         setCardIsValid(false);
  //       }
  //     });
  //   }
  // }, [elements]);

  // useEffect(() => {
  //   // Create PaymentIntent over Stripe API
  //   const amount =
  //     formValues.donationAmount === 'Other'
  //       ? formValues.customAmount
  //       : formValues.donationAmount;

  //   payments
  //     .createPaymentIntent({
  //       payment_method_types: ['card'],
  //       currency: formValues.currency,
  //       amount: amount * 100,
  //     })
  //     .then(clientSecret => {
  //       setClientSecret(clientSecret);
  //     })
  //     .catch(err => {
  //       setError(err.message);
  //     });
  // }, []);

  // const handleSubmit = async ev => {
  //   ev.preventDefault();
  //   setProcessing(true);

  //   // Step 3: Use clientSecret from PaymentIntent and the CardElement
  //   // to confirm payment with stripe.confirmCardPayment()
  //   const payload = await stripe.confirmCardPayment(clientSecret, {
  //     payment_method: {
  //       card: elements.getElement(CardElement),
  //       billing_details: {
  //         name: formValues.name,
  //       },
  //     },
  //   });

  //   if (payload.error) {
  //     setError(`Payment failed: ${payload.error.message}`);
  //     setProcessing(false);
  //     // console.log("[error]", payload.error);
  //   } else {
  //     setError(null);
  //     setSucceeded(true);
  //     setProcessing(false);
  //     setMetadata(payload.paymentIntent);
  //     setFormValues({});
  //     setClear(clear + 1);
  //     // console.log("[PaymentIntent]", payload.paymentIntent);
  //   }
  // };

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

  // const renderCreditCardForm = () => {
  //   const options = {
  //     style: {
  //       base: {
  //         color: '#32325d',
  //         fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
  //         fontSmoothing: 'antialiased',
  //         fontSize: '16px',
  //         '::placeholder': {
  //           color: '#aab7c4',
  //         },
  //       },
  //       invalid: {
  //         color: '#fa755a',
  //         iconColor: '#fa755a',
  //       },
  //     },
  //   };

  //   return (
  //     <Box mb={3}>
  //       <CardElement className="sr-input sr-card-element" options={options} />
  //     </Box>
  //   );
  // };

  const renderSectionHeader = (label, variant, bottomMargin) => {
    return (
      <Box mb={bottomMargin}>
        <Typography variant={variant}>{label}</Typography>
      </Box>
    );
  };

  // const renderForm = () => {
  //   // className="sr-combo-inputs"
  //   return (
  //     <>
  //       {renderSectionHeader('Choose an amount', 'h5', 2)}

  //       <Grid container spacing={4}>
  //         {renderField('currency')}
  //         {renderField('donationAmount')}
  //         {formValues.donationAmount === 'Other'
  //           ? renderField('customAmount')
  //           : null}
  //       </Grid>

  //       {/* {renderSectionHeader('Personal Information', 'h4', 2)} */}
  //       {/* <Box mb={2}> */}
  //       {renderPersonalInformationForm()}
  //       {/* </Box> */}

  //       {/* {renderSectionHeader('Payment Information', 'h4', 2)} */}
  //       {/* <Box mb={2}> */}
  //       {renderCreditCardForm()}
  //       {renderDonationAmount()}
  //       {error && <div className="message sr-field-error">{error}</div>}
  //       {/* </Box> */}
  //       {/* <Box mb={2} textAlign="right"> */}
  //       {renderCaptcha()}
  //       <Button
  //         variant="contained"
  //         color="primary"
  //         disabled={!isFormValid()}
  //         onClick={handleSubmit}
  //       >
  //         {' '}
  //         {processing ? 'Processing…' : 'Pay'}
  //       </Button>
  //       {/* </Box> */}
  //     </>
  //   );
  // };

  // const renderForm = () => {
  //   // className="sr-combo-inputs"
  //   return (
  //     <>
  //       {renderSectionHeader('Complete your donation', 'h5', 2)}

  //       {/* <Grid container spacing={4}>
  //         {renderField('currency')}
  //         {renderField('donationAmount')}
  //         {formValues.donationAmount === 'Other'
  //           ? renderField('customAmount')
  //           : null}
  //       </Grid> */}

  //       {/* {renderSectionHeader('Payment Information', 'h4', 2)} */}
  //       {/* <Box mb={2}> */}
  //       {renderCreditCardForm()}
  //     </>
  //   );
  // };

  const renderForm = () => {
    // // const stripe = useStripe();
    // const elements = useElements();
    // const options = useOptions();

    const handleSubmit = async event => {
      event.preventDefault();

      if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        return;
      }

      const payload = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardNumberElement),
      });
      console.log('[PaymentMethod]', payload);
    };

    return (
      <form onSubmit={handleSubmit}>
        <label>
          Card number
          <CardNumberElement
            options={options}
            onReady={() => {
              console.log('CardNumberElement [ready]');
            }}
            onChange={event => {
              console.log('CardNumberElement [change]', event);
            }}
            onBlur={() => {
              console.log('CardNumberElement [blur]');
            }}
            onFocus={() => {
              console.log('CardNumberElement [focus]');
            }}
          />
        </label>
        <label>
          Expiration date
          <CardExpiryElement
            options={options}
            onReady={() => {
              console.log('CardNumberElement [ready]');
            }}
            onChange={event => {
              console.log('CardNumberElement [change]', event);
            }}
            onBlur={() => {
              console.log('CardNumberElement [blur]');
            }}
            onFocus={() => {
              console.log('CardNumberElement [focus]');
            }}
          />
        </label>
        <label>
          CVC
          <CardCvcElement
            options={options}
            onReady={() => {
              console.log('CardNumberElement [ready]');
            }}
            onChange={event => {
              console.log('CardNumberElement [change]', event);
            }}
            onBlur={() => {
              console.log('CardNumberElement [blur]');
            }}
            onFocus={() => {
              console.log('CardNumberElement [focus]');
            }}
          />
        </label>
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
      </form>
    );
  };

  return (
    <div className="checkout-form">
      <div className="sr-payment-form">
        <div className="sr-form-row" />
        {renderForm()}
        {/* <Box>{succeeded ? renderSuccess() : renderForm()}</Box> */}
      </div>
    </div>
  );
};
export default PaymentInfo;
