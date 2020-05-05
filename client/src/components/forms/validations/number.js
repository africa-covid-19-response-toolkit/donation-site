/**
 * Util for number related validations
 */

export const isIntegerNumber = (val) => Number.isInteger(parseInt(val));
export const amountDecimalValidator = (val) => {
  const isDec2 = /^\d*(\.\d{0,2})?$/.test(val);
  return isDec2;
};
export const amountValidator = (val, x) => {
  const isDec2 = amountDecimalValidator(val);
  return isIntegerNumber(val) && val >= x && isDec2;
};
