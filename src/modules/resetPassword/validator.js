// @flow
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';
import * as React from 'react';

const passwordValidationRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
const validator: Object = Yup.object().shape({
  password: Yup.string()
    .required()
    .matches(
      passwordValidationRule,
      'Must Contain 8 Characters, One Uppercase, One Lowercase and One Number'
    ),
  confirmPassword: Yup.string()
    .required()
    .matches(
      passwordValidationRule,
      'Must Contain 8 Characters, One Uppercase, One Lowercase and One Number'
    )
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
