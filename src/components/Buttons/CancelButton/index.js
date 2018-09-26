// @flow
import * as React from 'react';
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

const CancelButton = ({ disabled, onClick }: Props): React.Node => (
  <BaseButton
    label="CANCEL"
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
