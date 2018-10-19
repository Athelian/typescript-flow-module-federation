// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';

type OptionalProps = {
  disabled: boolean,
  onClick: Function,
};

type Props = OptionalProps;

const defaultProps = {
  disabled: false,
  onClick: () => {},
};

const YesButton = ({ disabled, onClick }: Props): React.Node => (
  <BaseButton
    icon="CHECKED"
    label={<FormattedMessage id="components.button.yes" defaultMessage="YES" />}
    backgroundColor="TEAL"
    hoverBackgroundColor="TEAL_DARK"
    disabled={disabled}
    onClick={onClick}
  />
);

YesButton.defaultProps = defaultProps;

export default YesButton;
