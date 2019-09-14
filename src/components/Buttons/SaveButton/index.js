// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';

type OptionalProps = {
  disabled: boolean,
  isLoading: boolean,
  onClick: Function,
  label: React.Node,
  id: string,
};

type Props = OptionalProps;

const defaultProps = {
  disabled: false,
  isLoading: false,
  onClick: () => {},
  label: <FormattedMessage id="components.button.save" defaultMessage="SAVE" />,
  id: 'save_button',
};

const SaveButton = ({ disabled, isLoading, onClick, label, id, ...rest }: Props): React.Node => (
  <BaseButton
    icon="CHECKED"
    label={label}
    backgroundColor="TEAL"
    hoverBackgroundColor="TEAL_DARK"
    disabled={disabled}
    onClick={onClick}
    isLoading={isLoading}
    id={id}
    data-testid="saveButton"
    {...rest}
  />
);

SaveButton.defaultProps = defaultProps;

export default SaveButton;
