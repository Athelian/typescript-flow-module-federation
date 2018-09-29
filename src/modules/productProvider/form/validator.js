// @flow
import * as Yup from 'yup';

export default Yup.object().shape({
  exporter: Yup.string().required(),
  supplier: Yup.string().required(),
  origin: Yup.string().required(),
});
