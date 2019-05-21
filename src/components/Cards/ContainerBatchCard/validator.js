// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

const validator = ({ no, quantity }: { no: string, quantity: string }) =>
  Yup.object().shape({
    [no]: Yup.string().required(<FormattedMessage {...messages.no} />),
    [quantity]: Yup.number(<FormattedMessage {...messages.quantity} />),
  });

export default validator;
