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
  label: <FormattedMessage id="components.button.edit" defaultMessage="EDIT" />,
};

const EditButton = ({ disabled, isLoading, onClick, label, ...rest }: Props): React.Node => (
  <BaseButton
    icon="EDIT"
    label={label}
    backgroundColor="TEAL"
    hoverBackgroundColor="TEAL_DARK"
    disabled={disabled}
    onClick={onClick}
    isLoading={isLoading}
    data-testid="saveButton"
    {...rest}
  />
);

EditButton.defaultProps = defaultProps;

export default EditButton;
