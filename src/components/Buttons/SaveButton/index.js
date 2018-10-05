// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';

type OptionalProps = {
  disabled: boolean,
  isLoading: boolean,
  onClick: Function,
};

type Props = OptionalProps;

const defaultProps = {
  disabled: false,
  isLoading: false,
  onClick: () => {},
};

const SaveButton = ({ disabled, isLoading, onClick }: Props): React.Node => (
  <BaseButton
    icon="CHECKED"
    label={<FormattedMessage id="components.button.save" defaultMessage="SAVE" />}
    backgroundColor="TEAL"
    hoverBackgroundColor="TEAL_DARK"
    disabled={disabled}
    onClick={onClick}
    isLoading={isLoading}
  />
);

SaveButton.defaultProps = defaultProps;

export default SaveButton;
