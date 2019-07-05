// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

export default (Yup.object().shape({
  email: Yup.string()
    .required((<FormattedMessage {...messages.required} />: any))
    .email((<FormattedMessage {...messages.emailError} />: any)),
  password: Yup.string().required((<FormattedMessage {...messages.required} />: any)),
}): Object);
