// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';

export default (Yup.object().shape({
  name: Yup.string().required(),
  importer: Yup.object()
    .shape({
      id: Yup.string().required(),
    })
    .required(),
  serial: Yup.string().required(),
  janCode: Yup.string()
    .test(
      'janCode',
      ((
        <FormattedMessage
          id="modules.Products.janCodeValidation"
          defaultMessage="JAN Code must be exactly 13 characters"
        />
      ): any),
      value => {
        if (!value || (value && value.length === 13)) return true;
        return false;
      }
    )
    .nullable(),
  hsCode: Yup.string()
    .test(
      'hsCode',
      ((
        <FormattedMessage
          id="modules.Products.hsCodeValidation"
          defaultMessage="HS Code must be exactly 10 characters"
        />
      ): any),
      value => {
        if (!value || (value && value.length === 10)) return true;
        return false;
      }
    )
    .nullable(),
  productProviders: Yup.array()
    .of(Yup.object())
    .min(1),
  todo: Yup.object().shape({
    tasks: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(),
      })
    ),
  }),
}): Object);
