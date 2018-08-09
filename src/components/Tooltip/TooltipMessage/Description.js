// @flow
import * as React from 'react';
import { DividerLineStyle } from './style';

type Props = {
  children: React.Node,
};
const Description = ({ children }: Props) => (
  <div>
    <div className={DividerLineStyle} />
    {children}
  </div>
);

export default Description;
