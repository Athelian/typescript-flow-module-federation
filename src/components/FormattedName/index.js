// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

type OptionalProps = {
  showOnlyOneName: boolean,
};

type Props = OptionalProps & {
  firstName: string,
  lastName: string,
};

const defaultProps = {
  showOnlyOneName: false,
};

const FormattedName = ({ firstName, lastName, showOnlyOneName }: Props) => {
  if (showOnlyOneName) {
    return <FormattedMessage {...messages.oneName} values={{ firstName, lastName }} />;
  }
  return <FormattedMessage {...messages.name} values={{ firstName, lastName }} />;
};

FormattedName.defaultProps = defaultProps;

export default FormattedName;
