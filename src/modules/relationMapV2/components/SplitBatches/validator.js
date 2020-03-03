// @flow
import * as Yup from 'yup';

export default (min: number, max: number) =>
  (Yup.object().shape({
    no: Yup.string().required(),
    quantity: Yup.number()
      .min(min)
      .max(max),
  }): Object);
