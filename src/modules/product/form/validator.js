// @flow
import * as Yup from 'yup';

export default Yup.object().shape({
  name: Yup.string().required(),
  serial: Yup.string().required(),
});
