// @flow
import * as React from 'react';
import PreventInitialAnimation from 'components/PreventInitialAnimation';
import { ActionsWrapperStyle, FadeInStyle, FadeOutStyle } from './style';

type Action = {
  id: string,
  node: React.Node,
};

type Props = {
  actions: ?Array<Action>,
  visible: boolean,
  onClick: () => void,
};

function Actions({ actions, onClick, visible }: Props) {
  return (
    <PreventInitialAnimation isChildrenVisible={visible}>
      <div className={ActionsWrapperStyle} onClick={onClick} role="presentation">
        {actions &&
          actions.map((action, index) => (
            <div key={action.id} className={visible ? FadeInStyle(index) : FadeOutStyle(index)}>
              {action.node}
            </div>
          ))}
      </div>
    </PreventInitialAnimation>
  );
}

export default Actions;
