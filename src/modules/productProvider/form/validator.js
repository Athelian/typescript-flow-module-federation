// @flow
import * as Yup from 'yup';

export default (Yup.object().shape({
  exporter: Yup.string().required(),
  name: Yup.string().required(),
  todo: Yup.object().shape({
    tasks: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(),
      })
    ),
  }),
  inspectionFee: Yup.object().shape({
    currency: Yup.string().required(),
  }),
  unitPrice: Yup.object().shape({
    currency: Yup.string().required(),
  }),
}): Object);
