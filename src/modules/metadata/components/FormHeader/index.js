// @flow
import * as React from 'react';

import { FormHeaderWrapperStyle, TitleStyle } from './style';

type Props = {
  name: string | React.Node,
  children: React.Node,
};

const FormHeader = ({ name, children }: Props) => (
  <div className={FormHeaderWrapperStyle}>
    <div className={TitleStyle}>{name}</div>
    {children}
  </div>
);

export default FormHeader;
