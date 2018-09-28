// @flow
import * as React from 'react';
import { BaseButton } from 'components/Buttons';

type OptionalProps = {
  label: React.Node,
  disabled: boolean,
  onClick: Function,
};

type Props = OptionalProps;

const defaultProps = {
  label: 'NEW',
  disabled: false,
  onClick: () => {},
};

const CloneButton = ({ label, disabled, onClick }: Props): React.Node => (
  <BaseButton
    icon="CLONE"
    label={label}
    backgroundColor="TEAL"
    hoverBackgroundColor="TEAL_DARK"
    disabled={disabled}
    onClick={onClick}
  />
);

CloneButton.defaultProps = defaultProps;

export default CloneButton;
