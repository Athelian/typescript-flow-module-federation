// @flow
import * as Yup from 'yup';

export default Yup.object().shape({
  no: Yup.string().required(),
});
