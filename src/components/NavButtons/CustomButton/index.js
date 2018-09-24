// @flow
import * as React from 'react';
import { CustomButtonStyle, DisabledButtonStyle } from './style';

/*
Use "gray" for neutral actions like "Cancel" or "Edit"
Use "blue" for links that take you somewhere like "New Product"
Use "teal" for confirmations like "Create" or "Save"
Use "red" for high alert actions like "Delete"
*/

type OptionalProps = {
  disabled: boolean,
  color: 'gray' | 'blue' | 'teal' | 'red',
};

type Props = OptionalProps & {
  icon: any,
  label: string | React.Element<any>,
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
  disabled: false,
  color: 'gray',
};

export default CustomButton;
