// @flow
import * as Yup from 'yup';

export default (Yup.object().shape({
  no: Yup.string().required(),
  importer: Yup.object()
    .shape({
      id: Yup.string().required(),
    })
    .required(),
  batches: Yup.array().of(
    Yup.object().shape({
      no: Yup.string().required(),
      quantity: Yup.number(),
    })
  ),
  containers: Yup.array().of(
    Yup.object().shape({
      no: Yup.string().required(),
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
