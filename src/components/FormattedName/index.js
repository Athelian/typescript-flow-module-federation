// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

type Props = {
  firstName: string,
  lastName: string,
};

const FormattedName = ({ firstName, lastName }: Props) => (
  <FormattedMessage {...messages.name} values={{ firstName, lastName }} />
);

export default FormattedName;
