// @flow
import * as React from 'react';
import { InputGroupStyle } from './style';

type Props = {
  children: React.Node,
};

const InputGroup = ({ children }: Props) => <div className={InputGroupStyle}>{children}</div>;

export default InputGroup;
