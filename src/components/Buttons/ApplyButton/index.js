// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';

type Props = {|
  label: React.Node,
  disabled: boolean,
  onClick: Function,
  id?: string,
  borderRadius?: string,
  hideIcon?: boolean,
|};

const defaultProps = {
  label: <FormattedMessage id="components.button.apply" defaultMessage="APPLY" />,
  disabled: false,
  onClick: () => {},
};

const ApplyButton = ({
  label,
  disabled,
  onClick,
  hideIcon,
  borderRadius,
  ...rest
}: Props): React.Node => (
  <BaseButton
    icon={hideIcon ? '' : 'CONFIRM'}
    borderRadius={borderRadius}
    label={label}
    backgroundColor="TEAL"
    hoverBackgroundColor="TEAL_DARK"
    disabled={disabled}
    onClick={onClick}
    {...rest}
  />
);

ApplyButton.defaultProps = defaultProps;

export default ApplyButton;
