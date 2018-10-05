// @flow
import * as React from 'react';
import { ActionsWrapperStyle } from './style';

type Props = {
  visible: boolean,
  actions: Array<{
    id: string,
    node: React.Node,
  }>,
};

const Actions = ({ visible, actions }: Props) => (
  <div className={ActionsWrapperStyle(visible)}>
    {actions.map(action => (
      <React.Fragment key={action.id}>{action.node}</React.Fragment>
    ))}
  </div>
);

export default Actions;
