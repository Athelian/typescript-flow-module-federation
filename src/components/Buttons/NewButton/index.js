// @flow
import * as React from 'react';
import { BaseButton } from 'components/Buttons';

type OptionalProps = {
  label?: React.Node,
  disabled: boolean,
  onClick: Function,
};

type Props = OptionalProps;

const defaultProps = {
  disabled: false,
  onClick: () => {},
};

const NewButton = ({ label, disabled, onClick }: Props): React.Node => (
  <BaseButton
    icon="ADD"
    label={label || 'NEW'}
    backgroundColor="TEAL"
    hoverBackgroundColor="TEAL_DARK"
    disabled={disabled}
    onClick={onClick}
  />
);

NewButton.defaultProps = defaultProps;

export default NewButton;
