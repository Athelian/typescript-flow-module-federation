// @flow
import * as Yup from 'yup';

const validator = Yup.object().shape({
  poNo: Yup.string().required(),
  currency: Yup.string().required(),
  exporter: Yup.string().required(),
  orderItems: Yup.array().of(
    Yup.object().shape({
      batches: Yup.array().of(
        Yup.object().shape({
          no: Yup.string().required(),
          quantity: Yup.number(),
        })
      ),
    })
  ),
  todo: Yup.object().shape({
    tasks: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(),
      })
    ),
  }),
});

export default validator;
