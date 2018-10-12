// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';

type OptionalProps = {
  disabled: boolean,
  onClick: Function,
};

type Props = OptionalProps;

const defaultProps = {
  disabled: false,
  onClick: () => {},
};

const ActivateButton = ({ disabled, onClick }: Props): React.Node => (
  <BaseButton
    icon="ACTIVE"
    label={<FormattedMessage id="components.button.activate" defaultMessage="ACTIVATE" />}
    backgroundColor="TEAL"
    hoverBackgroundColor="TEAL_DARK"
    disabled={disabled}
    onClick={onClick}
  />
);

ActivateButton.defaultProps = defaultProps;

export default ActivateButton;
