// @flow
import * as Yup from 'yup';

export const validator: Object = Yup.object().shape({
  name: Yup.string().required(),
  tasks: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required(),
    })
  ),
});

export default validator;
