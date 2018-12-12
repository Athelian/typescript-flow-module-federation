// @flow
import * as React from 'react';
import { GenericNavBarStyle } from './style';

type Props = {
  children: React.Node,
};

const GenericNavBar = ({ children }: Props) => <div className={GenericNavBarStyle}>{children}</div>;

export default GenericNavBar;
