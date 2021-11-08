// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import BaseButton from '../LabelledButton';

type OptionalProps = {
  disabled: boolean,
  onClick: Function,
  label: React.Node,
};

type Props = OptionalProps;

const defaultProps = {
  disabled: false,
  onClick: () => {},
  label: <FormattedMessage id="components.NavBar.Filter.clearAll" defaultMessage="CLEAR ALL" />,
};

const ClearAllButton = ({ disabled, onClick, label }: Props): React.Node => (
  <BaseButton
    label={label}
    borderRadius="5px"
    textColor="GRAY_DARK"
    hoverTextColor="GRAY_DARK"
    backgroundColor="WHITE"
    hoverBackgroundColor="GRAY_SUPER_LIGHT"
    disabled={disabled}
    onClick={onClick}
  />
);

ClearAllButton.defaultProps = defaultProps;

export default ClearAllButton;
