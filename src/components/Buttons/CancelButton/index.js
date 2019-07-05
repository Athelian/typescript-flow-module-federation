// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import BaseButton from '../BaseButton';

type OptionalProps = {
  disabled: boolean,
  onClick: Function,
  label: React.Node,
};

type Props = OptionalProps;

const defaultProps = {
  disabled: false,
  onClick: () => {},
  label: <FormattedMessage id="components.button.cancel" defaultMessage="CANCEL" />,
};

const CancelButton = ({ disabled, onClick, label }: Props): React.Node => (
  <BaseButton
    label={label}
    textColor="GRAY_DARK"
    hoverTextColor="WHITE"
    backgroundColor="GRAY_SUPER_LIGHT"
    hoverBackgroundColor="GRAY_LIGHT"
    disabled={disabled}
    onClick={onClick}
  />
);

CancelButton.defaultProps = defaultProps;

export default CancelButton;
