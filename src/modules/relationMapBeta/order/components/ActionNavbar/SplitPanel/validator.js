// @flow
import * as Yup from 'yup';

export default (max: number) =>
  Yup.object().shape({
    quantity: Yup.number()
      .min(1)
      .max(max),
  });
