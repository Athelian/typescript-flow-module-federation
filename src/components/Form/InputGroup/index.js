// @flow
import * as React from 'react';
import { InputWrapperStyle } from './style';

type Props = {
  children: React.Node,
  direction?: 'row' | 'column',
  fieldGap?: number,
};

const defaultProps = {
  direction: 'row',
  fieldGap: 8,
};

function InputGroup({ children, direction = 'row', fieldGap = 8 }: Props) {
  return (
    <div className={InputWrapperStyle(direction, fieldGap)}>
      {React.Children.map(children, child => (
        <React.Fragment>{child}</React.Fragment>
      ))}
    </div>
  );
}

InputGroup.defaultProps = defaultProps;

export default InputGroup;
