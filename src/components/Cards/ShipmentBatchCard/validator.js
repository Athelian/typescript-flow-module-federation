// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

const validator = ({ no }: { no: string }) =>
  Yup.object().shape({
    [no]: Yup.string().required(<FormattedMessage {...messages.no} />),
  });

export default validator;
