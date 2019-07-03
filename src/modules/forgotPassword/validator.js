// @flow
import * as Yup from 'yup';

const validator: Object = Yup.object().shape({
  email: Yup.string()
    .email()
    .required(),
});

export default validator;
