// @flow
import * as Yup from 'yup';
import { START_DATE, DUE_DATE } from 'utils/task';

const startDateBinding = {
  startDateBinding: Yup.string()
    .nullable()
    .when('dueDateBinding', {
      is: START_DATE,
      then: Yup.string().notOneOf([DUE_DATE]),
      otherwise: Yup.string().nullable(),
    }),
};

export const circleValidator: Object = Yup.object().shape(startDateBinding);

const validator: Object = Yup.object().shape({
  name: Yup.string().required(),
  ...startDateBinding,
});

export default validator;
