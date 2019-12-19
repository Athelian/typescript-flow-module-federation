import * as Yup from 'yup';

const validator = Yup.object().shape({
  type: Yup.string().required(),
  status: Yup.string().required(),
});

export default validator;
