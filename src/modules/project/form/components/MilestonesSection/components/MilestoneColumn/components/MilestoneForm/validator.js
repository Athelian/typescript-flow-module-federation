// @flow
import * as Yup from 'yup';

const validator = Yup.object().shape({
  name: Yup.string().required(),
});

export default validator;
