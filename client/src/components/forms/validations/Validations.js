import {
  nameValidator as nameValidatorUtil,
  emailIsValid,
  lengthAtMostX,
} from "./text";
import { amountValidator as amountValidatorUtil } from "./number";
import errorTypes from "./errorTypes";

export const nameValidator = {
  validate: (value) => nameValidatorUtil(value),
  validationErrorMsg: errorTypes.empty,
};

export const nameMaxLengthValidator = {
  validate: (value) => lengthAtMostX(value, 100),
  validationErrorMsg: errorTypes.lengthAtMost100,
};

export const amountValidator = {
  validate: (value) => amountValidatorUtil(value, 10),
  validationErrorMsg: errorTypes.amountDec2Min10,
};

export const emailValidator = {
  validate: (value) => emailIsValid(value),
  validationErrorMsg: errorTypes.email,
};
