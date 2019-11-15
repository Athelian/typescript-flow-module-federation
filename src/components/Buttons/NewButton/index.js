// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';

type Props = {|
  label: React.Node,
  disabled: boolean,
  onClick: Function,
  id?: string,
  'data-testid'?: string,
|};

const defaultProps = {
  label: <FormattedMessage id="components.button.new" defaultMessage="NEW" />,
  disabled: false,
  onClick: () => {},
};

const NewButton = ({ label, disabled, onClick, ...rest }: Props): React.Node => (
  <BaseButton
    icon="ADD"
    label={label}
    backgroundColor="TEAL"
    hoverBackgroundColor="TEAL_DARK"
    disabled={disabled}
    onClick={onClick}
    data-testid="newButton"
    {...rest}
  />
);

NewButton.defaultProps = defaultProps;

export default NewButton;
