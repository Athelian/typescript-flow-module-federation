// @flow
import * as React from 'react';
import {
  type MutationFunctionOptions,
  type ExecutionResult,
  useMutation,
} from '@apollo/react-hooks';
import { DocumentNode } from 'graphql';
import { useHasPermissions } from 'contexts/Permissions';
import { ANIMATION_FINISHED } from 'components/Dialog';
import type { ActionConfig, DoAction, ActionRequest, ActionComponentProps } from './types';
import NoPermission from './NoPermission';

const ACTION_MUTATION_EXECUTION_TIME = 2000; // 2sec

export const useSheetActionDialog = (onDone: () => void): [boolean, () => void] => {
  const [open, setOpen] = React.useState(true);
  const handleClose = React.useCallback(() => {
    setOpen(false);
    setTimeout(() => onDone(), ANIMATION_FINISHED);
  }, [onDone]);

  return [open, handleClose];
};

export const executeActionMutation = (
  mutate: (MutationFunctionOptions<any, any>) => Promise<ExecutionResult<any>>,
  variables: Object,
  onComplete: () => void
) => {
  const timeBeforeMutation = Date.now();

  mutate({
    variables,
  })
    .then(() => {
      // TODO: Check and show error on not successful mutation
      const delayToClose = ACTION_MUTATION_EXECUTION_TIME - (Date.now() - timeBeforeMutation);
      setTimeout(onComplete, Math.max(delayToClose, 0));
    })
    .catch(() => {
      // TODO: Show error
      onComplete();
    });
};

export const useSheetActionAutoProcess = (
  mutation: DocumentNode,
  variables: Object,
  onComplete: () => void
) => {
  const [mutate] = useMutation(mutation);

  React.useEffect(() => {
    executeActionMutation(mutate, variables, onComplete);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const AC = (
  component: ActionComponentProps => React.Node,
  permissions: ((string) => boolean) => boolean = () => true
): ActionConfig => ({
  component,
  permissions,
});

type RendererProps = {
  config: ActionConfig,
  request: ActionRequest,
  onDone: () => void,
};

const SheetActionRenderer = ({ config, request, onDone }: RendererProps) => {
  const hasPermissions = useHasPermissions(request.ownedBy);

  if (!config.permissions(hasPermissions)) {
    return <NoPermission onDone={onDone} />;
  }

  return React.createElement(config.component, {
    entity: request.entity,
    item: request.item,
    onDone,
  });
};

type Props = {
  actions: { [string]: ActionConfig },
  children: ({ doAction: DoAction }) => React.Node,
};

const SheetAction = ({ actions, children }: Props) => {
  const [activeAction, setActiveAction] = React.useState<ActionRequest | null>(null);
  const doAction = React.useCallback(
    requestedAction => {
      if (activeAction === null) {
        setActiveAction(requestedAction);
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
      {activeAction && (
        <SheetActionRenderer
          request={activeAction}
          config={actions[activeAction.action]}
          onDone={handleDone}
        />
      )}
    </>
  );
};

export default SheetAction;
