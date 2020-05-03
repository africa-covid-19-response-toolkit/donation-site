/**
 * Util for number related validations
 */

export const isIntegerNumber = (val) => Number.isInteger(parseInt(val));
export const numberAtLeastX = (val, x) => {
  return val >= x;
};
