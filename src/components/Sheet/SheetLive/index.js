// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { uuid } from 'utils/id';
import logger from 'utils/logger';
import { getByPathWithDefault } from 'utils/fp';
import type { Action } from '../SheetState';
import { convertEntityToInput } from './helper';
import {
  blurMutation,
  focusesQuery,
  focusEventSubscription,
  focusMutation,
  focusSubscribeMutation,
  focusUnsubscribeAllMutation,
} from './query';

type Props = {
  entities: Array<{ id: string, type: string }>,
  focusedAt: { id: string, type: string, field: string } | null,
  dispatch: (action: Action) => void,
};

const SheetLive = ({ entities, focusedAt, dispatch }: Props) => {
  const client = useApolloClient();
  const [id, setId] = React.useState<string | null>(null);

  // Assign a table subscription ID
  React.useEffect(() => {
    setId(uuid());
  }, []);

  // Subscribe to focus events
  React.useEffect(() => {
    if (!id) {
      return () => {};
    }

    const subscription = client
      .subscribe({
        query: focusEventSubscription,
        variables: {
          id,
        },
        fetchPolicy: 'no-cache',
      })
      .subscribe({
        next(result) {
          const focusEvent = getByPathWithDefault(null, 'data.data.focusEvent', result);
          if (!focusEvent) {
            return;
          }

          dispatch({
            type: focusEvent.__typename === 'Focus' ? 'foreign_focus' : 'foreign_blur',
            payload: focusEvent,
          });
        },
        error: logger.error,
      });

    return () => subscription.unsubscribe();
  }, [client, dispatch, id]);

  // Get current foreign focuses
  React.useEffect(() => {
    if (!id || entities.length === 0) {
      return;
    }

    client
      .query({
        query: focusesQuery,
        variables: {
          id,
          entities: entities.map(({ id: entityId, type: entityType }) =>
            convertEntityToInput(entityId, entityType)
          ),
        },
        fetchPolicy: 'network-only',
      })
      .then(({ data }) => {
        const focuses = getByPathWithDefault([], 'focuses', data);

        dispatch({
          type: 'foreign_focuses',
          payload: focuses,
        });
      });
  }, [id, entities, client, dispatch]);

  // Notify current user focus
  React.useEffect(() => {
    if (!id) {
      return;
    }

    if (focusedAt) {
      client.mutate({
        mutation: focusMutation,
        variables: {
          id,
          input: {
            entity: convertEntityToInput(focusedAt.id, focusedAt.type),
            field: focusedAt.field,
          },
        },
      });
    } else {
      client.mutate({
        mutation: blurMutation,
        variables: {
          id,
        },
      });
    }
  }, [client, focusedAt, id]);

  // Ask which entities to listen for focuses
  React.useEffect(() => {
    if (!id || entities.length === 0) {
      return () => {};
    }

    client.mutate({
      mutation: focusSubscribeMutation,
      variables: {
        id,
        input: {
          entities: entities.map(({ id: entityId, type: entityType }) =>
            convertEntityToInput(entityId, entityType)
          ),
        },
      },
    });

    return () => {
      client.mutate({
        mutation: focusUnsubscribeAllMutation,
        variables: {
          id,
        },
      });
    };
  }, [id, entities, client]);

  return null;
};

export default SheetLive;
