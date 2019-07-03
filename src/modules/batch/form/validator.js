// @flow
import * as Yup from 'yup';

export default (Yup.object().shape({
  no: Yup.string().required(),
  orderItem: Yup.string().required(),
  quantity: Yup.number().required(),
  todo: Yup.object().shape({
    tasks: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(),
      })
    ),
  }),
}): Object);
