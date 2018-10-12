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
  label: <FormattedMessage id="components.button.sync" defaultMessage="SYNC" />,
  disabled: false,
  onClick: () => {},
};

const SyncButton = ({ label, disabled, onClick }: Props): React.Node => (
  <BaseButton
    icon="SYNC"
    label={label}
    textColor="TEAL"
    backgroundColor="GRAY_VERY_LIGHT"
    hoverTextColor="TEAL_DARK"
    hoverBackgroundColor="GRAY_LIGHT"
    disabled={disabled}
    onClick={onClick}
  />
);

SyncButton.defaultProps = defaultProps;

export default SyncButton;
