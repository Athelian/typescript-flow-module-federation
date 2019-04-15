// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';

const validator = Yup.object().shape({
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
      [Yup.ref('newPassword'), null],
      <FormattedMessage
        id="modules.profile.passwordNotMatch"
        defaultMessage="Password don't match"
      />
    ),
});

export default validator;
