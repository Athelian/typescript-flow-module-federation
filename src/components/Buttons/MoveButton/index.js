// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';

type OptionalProps = {
  label: React.Node,
  disabled: boolean,
  onClick: Function,
};

type Props = OptionalProps;

const defaultProps = {
  label: <FormattedMessage id="components.button.move" defaultMessage="MOVE" />,
  disabled: false,
  onClick: () => {},
};

const MoveButton = ({ label, disabled, onClick, ...rest }: Props): React.Node => (
  <BaseButton
    icon="EXCHANGE"
    label={label}
    backgroundColor="BLUE"
    hoverBackgroundColor="BLUE_DARK"
    disabled={disabled}
    onClick={onClick}
    data-testid="newButton"
    {...rest}
  />
);

MoveButton.defaultProps = defaultProps;

export default MoveButton;
