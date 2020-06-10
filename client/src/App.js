import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './components/CheckoutForm'
import languageStore from '../src/helpers/lang/language-store'

import { Box, Container, Grid } from '@material-ui/core'
import { auth } from './api/stripe'

// import "./App.css";
import 'assets/scss/material-kit-react.scss?v=1.8.0'

const stripePromise = auth.getPublicStripeKey().then((key) => loadStripe(key))

export default function App() {
  const langCode = languageStore.langCode
  const lang = languageStore.lang
  return (
    <Container maxWidth={'md'}>
      <Box my={4}>
        <header className="sr-header" style={{ display: 'flex' }}>
          <div className="sr-header__logo" />
          <a href="https://www.ethiopiatrustfund.org/">Home</a>
        </header>
        <Box mb={5}>
          <Elements stripe={stripePromise}>
            <CheckoutForm langCode={langCode} lang={lang} />
          </Elements>
        </Box>
        <Box>
          This is a donation site for{' '}
          <a
            href="https://ethiocovid19rt.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            the Ethiopia COVID-19 Response Taskforce
          </a>
        </Box>
      </Box>
    </Container>
  )
}
