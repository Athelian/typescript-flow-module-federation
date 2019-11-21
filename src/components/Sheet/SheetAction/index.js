// @flow
import * as React from 'react';
import type { ActionComponentProps, DoAction } from './types';

type Props = {
  actions: { [string]: (ActionComponentProps) => React.Node },
  children: ({ doAction: DoAction }) => React.Node,
};

export const useSheetActionDialog = (onDone: () => void): [boolean, () => void] => {
  const [open, setOpen] = React.useState(true);
  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  React.useEffect(() => {
    if (open) {
      return () => {};
    }

    const handler = setTimeout(() => onDone(), 300);

    return () => clearTimeout(handler);
  }, [open, onDone]);

  return [open, handleClose];
};

const SheetAction = ({ actions, children }: Props) => {
  const [activeAction, setActiveAction] = React.useState<{
    action: string,
    entity: { id: string, type: string },
    item: Object,
  } | null>(null);
  const doAction = React.useCallback(
    ({ action, entity, item }) => {
      if (activeAction === null) {
        setActiveAction({ action, entity, item });
      }
    },
    [activeAction]
  );
  const handleDone = React.useCallback(() => {
    setActiveAction(null);
  }, []);

  if (activeAction !== null && !actions[activeAction.action]) {
    throw new Error(`Action '${activeAction.action}' is not supported`);
  }

  return (
    <>
      {children({ doAction })}
      {activeAction &&
        React.createElement(actions[activeAction.action], {
          entity: activeAction.entity,
          item: activeAction.item,
          onDone: handleDone,
        })}
    </>
  );
};

export default SheetAction;
