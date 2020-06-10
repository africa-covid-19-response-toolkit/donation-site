// Page specific config
const page = {
  logo:
    'https://www.ethiopiatrustfund.org/wp-content/uploads/2018/09/edtf-yellow-alt.png',
  headerBackgroundImg:
    'https://www.ethiopiatrustfund.org/wp-content/uploads/2020/05/home_04152020-2_optimized.jpg?id=100482',
  donationNote:
    'EDTF COVID-19 is established by the EDTF Advisory Council in recognition of the new challenge and existential threat that coronavirus represents to the well being and livelihood of the Ethiopian people and in particular the most disadvantaged segments of the population.',
};

const colors = {
  primary: '#f8ba0d',
  secondary: '#1a191c',
};

// Map to environment name
const envToConfig = {
  local: {
    apiUrl: 'http://localhost:1337/dev',
    captchaKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  },
  dev: {
    apiUrl: 'https://ghbvixyza6.execute-api.us-east-1.amazonaws.com/dev',
    captchaKey: '6LcQGPMUAAAAAKmpXT-34g-mdFsd2zByI-mYn_jO',
  },
};

const env = process.env.REACT_APP_BUILD_ENV; // eslint-disable-line no-undef
const envName = env ? env : 'local';
const envConfig = envToConfig[envName];

const faqs = [
  {
    sectionTitle: 'About ECRT',
    faqs: [
      {
        question: 'As a community member, how do I get involved?',
        answer: 'How many people are on your team?',
      },
      {
        question: 'Who is leading ECRT?',
        answer: 'TBD',
      },
    ],
  },
  {
    sectionTitle: 'Toolkit',
    faqs: [
      {
        question: 'How do I access the toolkit?',
        answer: 'TBD',
      },
      {
        question:
          'As a government employee who wants to use the toolkit, where do I start?',
        answer: 'TBD',
      },
    ],
  },
  {
    sectionTitle: 'Donations',
    faqs: [
      {
        question: 'How can I donate?',
        answer: 'TBD',
      },
      {
        question: 'Is ECRT a nonprofit? Is my donation tax deductible?',
        answer: 'TBD',
      },
      {
        question: 'What are you using your donations for?',
        answer:
          'Additional possible FAQs, pulled from EDTF (https://www.ethiopiatrustfund.org/frequently-asked-questions-faqs/)',
      },
      {
        question: 'How do I access the Africa Covid-19 Response Toolkit?',
        answer:
          'You can access the ECRT Africa Covid-19 Response Toolkit at Github [here]. If you have any questions please email [email].',
      },
      {
        question: 'Is my donation tax deductible?',
        answer:
          'Yes, your donation is tax deductible since EDTF is a 501(c)(3) non-profit organization as shown publicly on the EDTF homepage and under Legal Documents.',
      },
    ],
  },
];

const config = {
  page,
  colors,
  faqs,

  ...envConfig,
  isLocal: env === 'local',
  isDev: env === 'dev',
  isProd: env === 'prod',
};

export default config;
