// @flow
import * as React from 'react';
import { FormLayoutWrapperStyle } from './style';

type Props = {
  children: React.Node,
};

const FormLayout = ({ children }: Props) => (
  <div className={FormLayoutWrapperStyle}>{children}</div>
);

export default FormLayout;
