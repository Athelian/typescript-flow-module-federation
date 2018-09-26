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

const ApproveButton = ({ disabled, onClick }: Props): React.Node => (
  <BaseButton
    icon="CHECKED"
    label="APPROVE"
    backgroundColor="BLUE"
    hoverBackgroundColor="BLUE_DARK"
    disabled={disabled}
    onClick={onClick}
  />
);

ApproveButton.defaultProps = defaultProps;

export default ApproveButton;
