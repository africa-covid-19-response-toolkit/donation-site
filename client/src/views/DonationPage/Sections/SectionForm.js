import React from 'react';

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';

// core components
import GridContainer from 'shared/Grid/GridContainer.js';
import GridItem from 'shared/Grid/GridItem.js';
import Parallax from 'shared/Parallax/Parallax.js';

// Custom Component
import DonationForms from '../../../components/DonationForms';
import CheckoutForm from '../../../components/CheckoutForm';
import languageStore from '../../../helpers/lang/language-store';

import config from '../../../constants/config';

import styles from 'assets/jss/material-kit-react/views/components.js';

// const useStyles = makeStyles(styles);
const useStyles = makeStyles({
  ...styles,
  root: {
    flexGrow: 1,
    color: `${config.colors.secondary}`,
    backgroundColor: `${config.colors.primary}`,
    backgroundImage: `${config.page.headerBackgroundImg ||
      'assets/img/bg7.jpg'} no-repeat`,
  },
  subtitle: {
    color: `${config.colors.secondary}`,
    fontWeight: '500',
  },
});

export default function SectionTop(props) {
  const { lang, langCode } = languageStore;
  const classes = useStyles();
  const { ...rest } = props;

  return (
    <div className={classes.root}>
      {/* <Parallax
      className={classes.root}
      image={`${config.page.headerBackgroundImg || 'assets/img/bg7.jpg'}`}
    > */}
      <div className={classes.container}>
        <GridContainer alignItems="center">
          <GridItem sm={12} md={6}>
            <div className={classes.brand}>
              {/* <h1 className={classes.title}>Donation</h1> */}
              <h3 className={classes.subtitle}>
                {config.page.donationNote || ''}
              </h3>
            </div>
          </GridItem>
          <GridItem sm={12} md={6}>
            <DonationForms />
          </GridItem>
        </GridContainer>
      </div>
      {/* </Parallax> */}
    </div>
  );
}
