import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { auth } from './api/stripe';

import 'assets/scss/material-kit-react.scss?v=1.8.0';

// pages for this product
import DonationPage from './views/DonationPage';
// import Components from './views/Components/Components.js'
import LandingPage from './views/LandingPage/LandingPage.js';
import ProfilePage from './views/ProfilePage/ProfilePage.js';
import LoginPage from './views/LoginPage/LoginPage.js';

const hist = createBrowserHistory();
const stripePromise = auth.getPublicStripeKey().then((key) => loadStripe(key));

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/landing-page" component={LandingPage} />
      <Route path="/profile-page" component={ProfilePage} />
      <Route path="/login-page" component={LoginPage} />
      <Elements stripe={stripePromise}>
        <Route path="/" component={DonationPage} />
      </Elements>
    </Switch>
  </Router>,
  document.getElementById('root')
);

// import React from "react";
// import ReactDOM from "react-dom";
// import "./index.css";
// import App from "./App";

// ReactDOM.render(<App />, document.getElementById("root"));
