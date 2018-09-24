// @flow
import * as React from 'react';
import { ListButtonStyle, ListButtonDisabledStyle } from './style';

type OptionalProps = {
  disabled: boolean,
  isActive: boolean,
};

type Props = OptionalProps & {
  label: string | React.Element<any>,
};

const ListButton = ({ label, disabled, isActive, ...rest }: Props) => (
  <button
    type="button"
    className={disabled ? ListButtonDisabledStyle : ListButtonStyle(isActive)}
    {...rest}
  >
    {label}
  </button>
);

ListButton.defaultProps = {
  disabled: false,
  isActive: false,
};

export default ListButton;
