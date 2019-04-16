// @flow
import * as Yup from 'yup';

export default Yup.object().shape({
  exporter: Yup.string().required(),
  name: Yup.string().required(),
});
