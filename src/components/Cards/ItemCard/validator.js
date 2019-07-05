// @flow
import * as Yup from 'yup';

const validator = ({
  no,
  quantity,
  price,
}: {
  no: string,
  quantity: string,
  price: string,
}): Object =>
  Yup.object().shape({
    [no]: Yup.string().required(),
    [quantity]: Yup.number(),
    [price]: Yup.object().shape({
      amount: Yup.number(),
    }),
  });

export default validator;
