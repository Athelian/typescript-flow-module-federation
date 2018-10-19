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

const NoButton = ({ disabled, onClick }: Props): React.Node => (
  <BaseButton
    label={<FormattedMessage id="components.button.no" defaultMessage="NO" />}
    textColor="GRAY_DARK"
    hoverTextColor="WHITE"
    backgroundColor="GRAY_SUPER_LIGHT"
    hoverBackgroundColor="GRAY_LIGHT"
    disabled={disabled}
    onClick={onClick}
  />
);

NoButton.defaultProps = defaultProps;

export default NoButton;
