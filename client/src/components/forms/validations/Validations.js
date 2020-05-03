import {
  nameValidator as nameValidatorUtil,
  emailIsValid,
  lengthAtMostX,
} from "./text";
import {
  isIntegerNumber as isIntegerNumberUtil,
  numberAtLeastX,
} from "./number";
import errorTypes from "./errorTypes";

export const nameValidator = {
  validate: (value) => nameValidatorUtil(value),
  validationErrorMsg: errorTypes.empty,
};

export const nameMaxLengthValidator = {
  validate: (value) => lengthAtMostX(value, 100),
  validationErrorMsg: errorTypes.lengthAtMost100,
};

export const numberValidator = {
  validate: (value) => isIntegerNumberUtil(value),
  validationErrorMsg: errorTypes.numberOnly,
};
export const numberMinValidator = {
  validate: (value) => numberAtLeastX(value, 10),
  validationErrorMsg: errorTypes.numberMin10,
};

export const emailValidator = {
  validate: (value) => emailIsValid(value),
  validationErrorMsg: errorTypes.email,
};
