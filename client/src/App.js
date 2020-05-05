import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./components/CheckoutForm";

import { Box, Container, Grid } from "@material-ui/core";
import api from "./api";

// import "./App.css";

const stripePromise = api.getPublicStripeKey().then((key) => loadStripe(key));

export default function App() {
  return (
    <Container maxWidth={'md'}>
      <Box my={4}>
        <header className="sr-header" style={{ display: "flex" }}>
          <div className="sr-header__logo" />
          <a href="https://www.ethiopiatrustfund.org/">Home</a>
        </header>
        <Box mb={5}>
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </Box>
        <Box>
          This is a donation site for {" "}
          <a href="https://ethiocovid19rt.com" target="_blank" without rel="noopener noreferrer">the Ethiopia COVID-19 Response Taskforce</a>
        </Box>
      </Box>
    </Container>
  );
}
