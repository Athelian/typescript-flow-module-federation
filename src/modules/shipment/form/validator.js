// @flow
import * as Yup from 'yup';

export default Yup.object().shape({
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
});
