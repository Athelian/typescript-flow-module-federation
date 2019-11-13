// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';

type Props = {|
  disabled: boolean,
  onClick: Function,
  className?: string,
  'data-testid'?: string,
|};

const defaultProps = {
  disabled: false,
  onClick: () => {},
};

const ApproveButton = ({ disabled, onClick, ...rest }: Props): React.Node => (
  <BaseButton
    icon="CHECKED"
    label={<FormattedMessage id="components.button.approve" defaultMessage="APPROVE" />}
    backgroundColor="BLUE"
    hoverBackgroundColor="BLUE_DARK"
    disabled={disabled}
    onClick={onClick}
    {...rest}
  />
);

ApproveButton.defaultProps = defaultProps;

export default ApproveButton;
