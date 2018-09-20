// @flow
import * as Yup from 'yup';

const validator = Yup.object().shape({
  poNo: Yup.string().required(),
  currency: Yup.string().required(),
  exporter: Yup.string().required(),
});

export default validator;
