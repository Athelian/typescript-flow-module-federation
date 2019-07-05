// @flow
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';
import * as React from 'react';

const validator: Object = Yup.object().shape({
  password: Yup.string()
    .required()
    .min(6),
  confirmPassword: Yup.string()
    .required()
    .min(6)
    .oneOf(
      // $FlowFixMe type not support yet
      [Yup.ref('password'), null],
      ((
        <FormattedMessage
          id="modules.resetPassword.passwordNotMatch"
          defaultMessage="Password don't match"
        />
      ): any)
    ),
});

export default validator;
