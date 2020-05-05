const errorStarter = "formErrors.";
const errorTypes = {
  empty: errorStarter + "empty",
  numberOnly: errorStarter + "numberOnly",
  email: errorStarter + "email",
  lengthAtMost100: errorStarter + "lengthAtMost100",
  amountDec2Min10: errorStarter + "amountDec2Min10",
};

export default errorTypes;
