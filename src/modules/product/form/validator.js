// @flow
import * as Yup from 'yup';

export default Yup.object().shape({
  name: Yup.string().required(),
  serial: Yup.string().required(),
  productProviders: Yup.array()
    .of(Yup.string().min(1))
    .required(),
});
