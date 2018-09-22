import * as Yup from 'yup';

const validator = Yup.object().shape({
  name: Yup.string().required(),
  color: Yup.string().required(),
  entityTypes: Yup.array()
    .of(Yup.string().min(1))
    .required(),
});
export default validator;
