const errorStarter = "formErrors.";
const errorTypes = {
  empty: errorStarter + "empty",
  numberOnly: errorStarter + "numberOnly",
  email: errorStarter + "email",
  lengthAtMost100: errorStarter + "lengthAtMost100",
  numberMin10: errorStarter + "numberMin10",
};

export default errorTypes;
