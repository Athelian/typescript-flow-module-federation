// @flow
import * as Yup from 'yup';

export default Yup.object().shape({
  name: Yup.string().required(),
  serial: Yup.string().required(),
  hsCode: Yup.string()
    .min(10)
    .max(10),
  janCode: Yup.string()
    .min(13)
    .max(13),
  productProviders: Yup.array()
    .of(Yup.string().min(1))
    .required(),
});
