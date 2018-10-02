import * as Yup from 'yup';

// Refer https://gist.github.com/olmokramer/82ccce673f86db7cda5e
const validator = Yup.object().shape({
  name: Yup.string().required(),
  color: Yup.string()
    .required()
    .transform(function transform(currentValue) {
      return this.isType(currentValue) && currentValue !== null
        ? currentValue.replace('#', '')
        : currentValue;
    })
    .trim()
    .min(6),
  entityTypes: Yup.array()
    .of(Yup.string().min(1))
    .required(),
});
export default validator;
