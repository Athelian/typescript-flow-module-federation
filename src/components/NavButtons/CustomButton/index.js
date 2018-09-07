// @flow
import * as React from 'react';
import { CustomButtonStyle, DisabledButtonStyle } from './style';

/*
Use "gray" for neutral actions like "Cancel" or "Edit"
Use "blue" for links that take you somewhere like "New Product"
Use "teal" for confirmations like "Create" or "Save"
Use "red" for high alert actions like "Delete"
*/

type Props = {
  label: string | React.Element<any>,
  icon?: any,
  color?: 'gray' | 'blue' | 'teal' | 'red',
  disabled?: boolean,
};

const CustomButton = ({ label, icon, color, disabled, ...rest }: Props) => (
  <button
    type="button"
    className={disabled ? DisabledButtonStyle : CustomButtonStyle(color)}
    disabled={disabled}
    {...rest}
  >
    <span>{label}</span>
    {icon}
  </button>
);

CustomButton.defaultProps = {
  icon: '',
  disabled: false,
};

export default CustomButton;
