// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

type OptionalProps = {
  showOnlyOneName: boolean,
  firstName: string,
  lastName: string,
};

type Props = OptionalProps;

const defaultProps = {
  showOnlyOneName: false,
  firstName: '',
  lastName: '',
};

const FormattedName = ({ firstName, lastName, showOnlyOneName }: Props) => {
  if (showOnlyOneName) {
    return <FormattedMessage {...messages.oneName} values={{ firstName, lastName }} />;
  }
  return <FormattedMessage {...messages.name} values={{ firstName, lastName }} />;
};

FormattedName.defaultProps = defaultProps;

export default FormattedName;
