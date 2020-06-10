import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// react components for routing our app without refresh
import { Link } from 'react-router-dom';
// @material-ui/core components
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
// @material-ui/icons
// core components
import Header from 'shared/Header/Header.js';
import Footer from 'shared/Footer/Footer.js';

import SectionForm from './Sections/SectionForm.js';
import SectionFaq from './Sections/SectionFaq.js';

import styles from 'assets/jss/material-kit-react/views/components.js';

const useStyles = makeStyles(theme => ({
  ...styles,
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: '95%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
}));

export default function DonationPage(props) {
  const classes = useStyles();

  const { ...rest } = props;
  return (
    <div>
      <Header
        brand={
          <img
            src="https://www.ethiopiatrustfund.org/wp-content/uploads/2018/09/edtf-yellow-alt.png"
            height="30"
          />
        }
        // fixed
        // position="relative"
        color="transparent"
        {...rest}
        // changeColorOnScroll={{
        //   height: 400,
        //   color: 'white',
        // }}
        // rightLinks={<HeaderLinks />}
      />

      <SectionForm />

      {/* <div className={classNames(classes.main, classes.mainRaised)}>
        <SectionFaq />
      </div> */}

      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper elevation={1} className={classes.paper}>
            <SectionFaq />
          </Paper>
        </main>
      </React.Fragment>

      <Footer />
    </div>
  );
}
