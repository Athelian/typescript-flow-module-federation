// @flow
import * as Yup from 'yup';

export default (Yup.object().shape({
  no: Yup.string().required(),
  batches: Yup.array().of(
    Yup.object().shape({
      no: Yup.string().required(),
      quantity: Yup.number(),
    })
  ),
}): Object);
