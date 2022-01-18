// @flow
import * as Yup from 'yup';

const validator = (Yup.object().shape({
  no: Yup.string().required(),
  importer: Yup.object()
    .shape({
      id: Yup.string().required(),
    })
    .required(),
  batches: Yup.array().of(
    Yup.object().shape({
      no: Yup.string().required(),
      quantity: Yup.number(),
    })
  ),
  containers: Yup.array().of(
    Yup.object().shape({
      no: Yup.string().required(),
    })
  ),
  todo: Yup.object().shape({
    tasks: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(),
      })
    ),
  }),
}): Object);

const getValidationByAutoTracking = ({ autoTrackingBy }: { autoTrackingBy: string }): Object => {
  let validationFieldName;
  // Convert "autoTrackingBy" value to the relevant top-level value of the submit form
  switch (autoTrackingBy) {
    case 'MasterBlNo':
      validationFieldName = 'masterBlNo';
      break;
    case 'HouseBlNo':
      validationFieldName = 'blNo';
      break;
    case 'BookingNo':
      validationFieldName = 'bookingNo';
      break;
    default:
      validationFieldName = '';
  }
  return validator.shape({
    [(validationFieldName: string)]: Yup.string().required(),
  });
};

export default validator;
export { getValidationByAutoTracking };
