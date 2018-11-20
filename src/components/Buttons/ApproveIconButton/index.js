// @flow
import * as React from 'react';
import { BaseButton } from 'components/Buttons';
import { ButtonWrapperStyle } from './style';

type OptionalProps = {
  hasApproved: boolean,
  onClick: Function,
};

type Props = OptionalProps;

const defaultProps = {
  hasApproved: false,
  onClick: () => {},
};

const ApproveIconButton = ({ hasApproved, onClick, ...rest }: Props): React.Node => (
  <BaseButton
    label=""
    icon="CHECKED"
    className={ButtonWrapperStyle}
    backgroundColor={hasApproved ? 'BLUE' : 'GRAY'}
    hoverBackgroundColor={hasApproved ? 'BLUE_DARK' : 'GRAY_DARK'}
    onClick={onClick}
    {...rest}
  />
);

ApproveIconButton.defaultProps = defaultProps;

export default ApproveIconButton;
