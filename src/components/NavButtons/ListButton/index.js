// @flow
import * as React from 'react';
import { ListButtonStyle, ListButtonDisabledStyle } from './style';

type Props = {
  label: string | React.Element<any>,
  disabled?: boolean,
  isActive?: boolean,
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
