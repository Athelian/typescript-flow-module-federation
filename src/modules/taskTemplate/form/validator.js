// @flow
import * as Yup from 'yup';

const validator: Object = Yup.object().shape({
  name: Yup.string().required(),
  entityType: Yup.string().required(),
  tasks: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required(),
    })
  ),
});

export default validator;
