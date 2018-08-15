// @flow
import * as React from 'react';
import { WrapperStyle, FieldStyle } from './style';

type Props = {
  children: React.Node,
  direction?: 'column' | 'row',
};

const defaultProps = {
  direction: 'row',
};

function InputGroup({ children, direction = 'row' }: Props) {
  return (
    <div className={WrapperStyle(direction)}>
      {React.Children.map(children, child => (
        <div className={FieldStyle}>{React.cloneElement(child)}</div>
      ))}
    </div>
  );
}

InputGroup.defaultProps = defaultProps;

export default InputGroup;
