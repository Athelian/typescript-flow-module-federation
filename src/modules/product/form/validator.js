// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';

export default Yup.object().shape({
  name: Yup.string().required(),
  serial: Yup.string().required(),
  janCode: Yup.string().test(
    'janCode',
    <FormattedMessage
      id="modules.Products.janCodeValidation"
      defaultMessage="JAN Code must be exactly 13 characters"
    />,
    value => {
      if (!value || (value && value.length === 13)) return true;
      return false;
    }
  ),
  hsCode: Yup.string().test(
    'hsCode',
    <FormattedMessage
      id="modules.Products.hsCodeValidation"
      defaultMessage="HS Code must be exactly 10 characters"
    />,
    value => {
      if (!value || (value && value.length === 10)) return true;
      return false;
    }
  ),
  productProviders: Yup.array()
    .of(Yup.string().min(1))
    .required(),
});
