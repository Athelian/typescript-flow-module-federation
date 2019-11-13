// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';

type Props = {|
  label: React.Node,
  disabled: boolean,
  onClick: Function,
  id?: string,
|};

const defaultProps = {
  label: <FormattedMessage id="components.button.apply" defaultMessage="APPLY" />,
  disabled: false,
  onClick: () => {},
};

const ApplyButton = ({ label, disabled, onClick, ...rest }: Props): React.Node => (
  <BaseButton
    icon="CONFIRM"
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
