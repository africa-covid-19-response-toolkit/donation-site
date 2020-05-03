const DEFAULT_CURRENCY = "USD";
const DEFAULT_AMOUNT = 100;
const CheckoutFormInitialState = {
  name: "",
  companyName: "",
  email: "",
  currency: DEFAULT_CURRENCY,
  donationAmount: DEFAULT_AMOUNT,
  customAmount: 0,
  anonymous: "",
  comment: "",
};
export default CheckoutFormInitialState;
