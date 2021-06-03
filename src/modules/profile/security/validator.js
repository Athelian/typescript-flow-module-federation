// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';

const passwordValidationRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
const validator: Object = Yup.object().shape({
  currentPassword: Yup.string()
    .required()
    .min(6),
  newPassword: Yup.string()
    .required()
    .matches(passwordValidationRule, () => {
      return (
        <FormattedMessage
          id="modules.profile.passwordInvalid"
          defaultMessage="Must Contain 8 Characters, One Uppercase, One Lowercase and One Number"
        />
      );
    }),
  confirmPassword: Yup.string()
    .required()
    .matches(passwordValidationRule, () => {
      return (
        <FormattedMessage
          id="modules.profile.passwordInvalid"
          defaultMessage="Must Contain 8 Characters, One Uppercase, One Lowercase and One Number"
        />
      );
    })
    .oneOf(
      // $FlowFixMe type not support yet
      [Yup.ref('newPassword'), null],
      ((
        <FormattedMessage
          id="modules.profile.passwordNotMatch"
          defaultMessage="Password don't match"
        />
      ): any)
    ),
});

export default validator;
