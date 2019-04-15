// @flow
import * as Yup from 'yup';

const validator = Yup.object().shape({
  email: Yup.string()
    .email()
    .required(),
});

export default validator;
