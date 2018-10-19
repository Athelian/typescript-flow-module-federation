// @flow
import * as Yup from 'yup';

const validator = ({ no, quantity }: { no: string, quantity: string }) =>
  Yup.object().shape({
    [no]: Yup.string().required('No is required field'),
    [quantity]: Yup.number('Quantity is must be a number'),
  });

export default validator;
