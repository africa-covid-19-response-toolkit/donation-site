import {
  nameValidator,
  emailValidator,
  amountValidator,
} from '../components/forms/validations/Validations';

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US dollar' },
  // { code: 'EUR', symbol: '€', name: 'Euro' },
  // { code: 'GBP', symbol: '£', name: 'Pound Sterling' },
  // { code: 'AUD', symbol: '$', name: 'Australian Dollars' },
  // { code: 'CAD', symbol: '$', name: 'Canadian Dollars' },
  // { code: 'JPY', symbol: '¥', name: 'Japanees Yen ' },
  // { code: 'NOK', symbol: 'NOK kr', name: 'Norwegian Krone' },
  // { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  // { code: 'SEK', symbol: 'SEK kr', name: 'Swidish Korona' },
  // { code: 'CHF', symbol: 'CHF', name: 'Swiss Frank' },
  // { code: 'KES', symbol: 'Ksh', name: 'Kenyan Chilling' },
  // { code: 'SAR', symbol: 'ريال سعودي', name: 'Saudi Riyal' },
  // { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
];

const DEFAULT_CURRENCY = 'USD';
const DEFAULT_AMOUNT = 100;
const AMOUNTS = [30, 50, 100, 500, 1000, 2000, 10000];
const COMMON_FIELDS = (lang, handleFieldChange, langCode) => {
  return [
    {
      type: 'text',
      label: lang.t('firstName'),
      property: 'firstName',
      focus: false,
      onChange: handleFieldChange('firstName'),
      onValidate: nameValidator.validate,
      validationErrorMsg: lang.t(nameValidator.validationErrorMsg),
    },
    {
      type: 'text',
      label: lang.t('lastName'),
      property: 'lastName',
      focus: false,
      onChange: handleFieldChange('lastName'),
      onValidate: nameValidator.validate,
      validationErrorMsg: lang.t(nameValidator.validationErrorMsg),
    },
    {
      type: 'text',
      label: lang.t('companyName'),
      property: 'companyName',
      focus: false,
      onChange: handleFieldChange('companyName'),
    },
    {
      type: 'text',
      label: lang.t('email'),
      property: 'email',
      focus: false,
      onChange: handleFieldChange('email'),
      onValidate: emailValidator.validate,
      validationErrorMsg: lang.t(emailValidator.validationErrorMsg),
    },
    {
      type: 'select',
      label: lang.t('currency.label'),
      property: 'currency',
      defaultvalue: DEFAULT_CURRENCY,
      onChange: handleFieldChange('currency'),
      choices: CURRENCIES.map(c => ({
        label: lang.t(`currency.${c.code}`),
        value: c.code,
      })),
    },
    {
      type: 'toggleButton',
      label: lang.t('donationAmount'),
      property: 'donationAmount',
      defaultvalue: DEFAULT_AMOUNT,
      onChange: handleFieldChange('donationAmount'),
      choices: AMOUNTS.map(c => ({
        label: c.toLocaleString(navigator.language, {
          minimumFractionDigits: 2,
        }),
        value: c,
      })),
    },
    {
      type: 'switch',
      label: lang.t('anonymousDonation'),
      property: 'anonymousDonation',
      onChange: handleFieldChange('anonymousDonation'),
      onLabel: lang.t('yes'),
      offLabel: lang.t('no'),
    },
    {
      type: 'text',
      label: lang.t('customAmount'),
      property: 'customAmount',
      focus: false,
      active: false,
      onValidate: amountValidator.validate,
      validationErrorMsg: lang.t(amountValidator.validationErrorMsg),
      onChange: handleFieldChange('customAmount'),
    },
    {
      type: 'multiline',
      label: lang.t('comment'),
      property: 'comment',
      focus: false,
      onChange: handleFieldChange('comment'),
    },
    {
      type: 'text',
      label: lang.t('twitterHandle'),
      property: 'twitterHandle',
      focus: false,
      onChange: handleFieldChange('twitterHandle'),
    },
    {
      type: 'text',
      label: lang.t('igHandle'),
      property: 'igHandle',
      focus: false,
      onChange: handleFieldChange('igHandle'),
    },
  ];
};

export { COMMON_FIELDS };
