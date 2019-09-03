// @flow
import * as Yup from 'yup';

type Props = {
  name: string,
};

const validator = ({ name }: Props) =>
  Yup.object().shape({
    [name]: Yup.string().required(),
  });

export default validator;
