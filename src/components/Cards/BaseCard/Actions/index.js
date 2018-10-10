// @flow
import * as React from 'react';
import { ActionsWrapperStyle } from './style';

type Props = {
  visible: boolean,
  children: React.Node,
};

const Actions = ({ visible, children }: Props) => (
  <div className={ActionsWrapperStyle(visible)}>{children}</div>
);

export default Actions;
