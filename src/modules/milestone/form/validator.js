import * as Yup from 'yup';

// Refer https://gist.github.com/olmokramer/82ccce673f86db7cda5e
const validator = Yup.object().shape({
  name: Yup.string().required(),
});
export default validator;
