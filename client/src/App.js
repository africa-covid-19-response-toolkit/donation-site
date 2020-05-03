import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import DemoText from "./components/DemoText";
import CheckoutForm from "./components/CheckoutForm";

import { Box, Container, Grid } from "@material-ui/core";
import api from "./api";

import "./App.css";

const stripePromise = api.getPublicStripeKey().then((key) => loadStripe(key));

export default function App() {
  return (
    <Box>
      <Container>
        <div className="sr-root">
          <div className="sr-main">
            {" "}
            <header className="sr-header">
              <div className="sr-header__logo" />
            </header>
          </div>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </Grid>
        </Grid>
      </Container>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}></Grid>
          <DemoText />
        </Grid>
      </Container>
    </Box>
  );
}
