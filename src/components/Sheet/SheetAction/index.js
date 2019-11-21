// @flow
import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { DocumentNode } from 'graphql';
import { ANIMATION_FINISHED } from 'components/Dialog';
import type { ActionComponentProps, DoAction } from './types';

type Props = {
  actions: { [string]: (ActionComponentProps) => React.Node },
  children: ({ doAction: DoAction }) => React.Node,
};

export const useSheetActionDialog = (onDone: () => void): [boolean, () => void] => {
  const [open, setOpen] = React.useState(true);
  const handleClose = React.useCallback(() => {
    setOpen(false);
    setTimeout(() => onDone(), ANIMATION_FINISHED);
  }, [onDone]);

  return [open, handleClose];
};

export const useSheetActionAutoProcess = (
  mutation: DocumentNode,
  variables: Object,
  onComplete: () => void
) => {
  const [mutate] = useMutation(mutation);

  React.useEffect(() => {
    const timeBeforeMutation = Date.now();

    mutate({
      variables,
    })
      .then(() => {
        // TODO: Check and show error on not successful mutation
        const delayToClose = 2000 - (Date.now() - timeBeforeMutation);
        setTimeout(onComplete, Math.max(delayToClose, 0));
      })
      .catch(() => {
        // TODO: Show error
        onComplete();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
