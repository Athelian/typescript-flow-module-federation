// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';

const validator: Object = Yup.object().shape({
  currentPassword: Yup.string()
    .required()
    .min(6),
  newPassword: Yup.string()
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
          id="modules.profile.passwordNotMatch"
          defaultMessage="Password don't match"
        />
      ): any)
    ),
});

export default validator;
