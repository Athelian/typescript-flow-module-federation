// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';

type OptionalProps = {
  label: React.Node,
  disabled: boolean,
  onClick: Function,
};

type Props = OptionalProps;

const defaultProps = {
  label: <FormattedMessage id="components.button.new" defaultMessage="NEW" />,
  disabled: false,
  onClick: () => {},
};

const NewButton = ({ label, disabled, onClick }: Props): React.Node => (
  <BaseButton
    icon="ADD"
    label={label}
    backgroundColor="TEAL"
    hoverBackgroundColor="TEAL_DARK"
    disabled={disabled}
    onClick={onClick}
  />
);

NewButton.defaultProps = defaultProps;

export default NewButton;
