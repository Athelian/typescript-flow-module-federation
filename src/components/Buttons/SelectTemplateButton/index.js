// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';

type Props = {|
  disabled: boolean,
  isLoading: boolean,
  onClick: Function,
  label: React.Node,
|};

const defaultProps = {
  disabled: false,
  isLoading: false,
  onClick: () => {},
  label: <FormattedMessage id="components.button.showTemplate" defaultMessage="USE TEMPLATE" />,
};

const SelectTemplateButton = ({
  disabled,
  isLoading,
  onClick,
  label,
  ...rest
}: Props): React.Node => (
  <BaseButton
    icon="TEMPLATE"
    label={label}
    backgroundColor="TEAL"
    hoverBackgroundColor="TEAL_DARK"
    disabled={disabled}
    onClick={onClick}
    isLoading={isLoading}
    data-testid="selectTemplateButton"
    {...rest}
  />
);

SelectTemplateButton.defaultProps = defaultProps;

export default SelectTemplateButton;
