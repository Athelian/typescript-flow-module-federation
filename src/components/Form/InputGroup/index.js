// @flow
import * as React from 'react';
import { WrapperStyle, FieldStyle } from './style';

type Props = {
  children: React.Node,
};

function InputGroup({ children }: Props) {
  return (
    <div className={WrapperStyle}>
      {React.Children.map(children, child => (
        <div className={FieldStyle}>{React.cloneElement(child)}</div>
      ))}
    </div>
  );
}

export default InputGroup;
