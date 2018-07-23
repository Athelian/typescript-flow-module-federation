// @flow

/**
 * Transform Yup ValidationError to a more usable object
 */
export default function yupToFormErrors(yupError: any) {
  return yupError.inner.reduce((errors, { path, message }) => {
    if (!errors[path]) {
      return { ...errors, [path]: message };
    }
    return errors;
  }, {});
}
