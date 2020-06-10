import React from 'react';
// plugin that creates slider
import classNames from 'classnames';
import Slider from 'nouislider';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import config from '../../../constants/config';

import styles from 'assets/jss/material-kit-react/views/componentsSections/basicsStyle.js';

const useStyles = makeStyles({
  ...styles,
  root: {
    paddingTop: 30,
    paddingBottom: 30,
  },
});

export default function SectionFaq() {
  const { faqs } = config;
  const classes = useStyles();

  const faqPanels = list =>
    list &&
    list.map((l, key) => (
      <ExpansionPanel key={key}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>
            {l.question && l.question}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>{l.answer && l.answer}</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    ));

  const faqSections =
    faqs &&
    faqs.map((section, key) => (
      <div key={key}>
        <h3>{section.sectionTitle}</h3>

        {faqPanels(section.faqs)}
      </div>
    ));

  return (
    <div className={classNames(classes.sections, classes.root)}>
      <div className={classes.container}>
        <h2>Frequently asked questions</h2>

        {faqSections}

        {/* <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              Expansion Panel 1
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography className={classes.heading}>
              Expansion Panel 2
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel> */}
      </div>
    </div>
  );
}
