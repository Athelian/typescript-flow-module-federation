// @flow
import * as Yup from 'yup';

export default (Yup.object().shape({
  no: Yup.string().required(),
  quantity: Yup.number().required(),
  price: Yup.object().shape({
    amount: Yup.number().required(),
    currency: Yup.string().required(),
  }),
  batches: Yup.array().of(
    Yup.object().shape({
      no: Yup.string().required(),
      quantity: Yup.number(),
    })
  ),
  todo: Yup.object().shape({
    tasks: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(),
      })
    ),
  }),
}): Object);
