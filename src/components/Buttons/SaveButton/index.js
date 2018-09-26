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

const SaveButton = ({ disabled, onClick }: Props): React.Node => (
  <BaseButton
    icon="CHECKED"
    label="SAVE"
    backgroundColor="TEAL"
    hoverBackgroundColor="TEAL_DARK"
    disabled={disabled}
    onClick={onClick}
  />
);

SaveButton.defaultProps = defaultProps;

export default SaveButton;
