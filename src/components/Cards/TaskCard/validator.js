// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

const validator = ({ name }: { name: string }) =>
  Yup.object().shape({
    [name]: Yup.string().required(<FormattedMessage {...messages.name} />),
  });

export default validator;
