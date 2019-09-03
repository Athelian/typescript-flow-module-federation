// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import logger from 'utils/logger';
import { getByPathWithDefault } from 'utils/fp';
import { useSheetState } from '../SheetState';
import { Actions } from '../SheetState/contants';
import { useSheetLiveID } from './index';
import { convertEntityToInput } from './helper';
import {
  blurMutation,
  focusesQuery,
  focusEventSubscription,
  focusMutation,
  focusSubscribeMutation,
  focusUnsubscribeMutation,
} from './query';

export const useSheetLiveFocus = () => {
  const id = useSheetLiveID();
  const client = useApolloClient();
  const { state, dispatch } = useSheetState();

  const { entities, focusedAt } = state;
  const focusedEntity = focusedAt ? focusedAt.cell.entity : null;
  const entitiesRef = React.useRef([]);

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
            type: focusEvent.__typename === 'Focus' ? Actions.FOREIGN_FOCUS : Actions.FOREIGN_BLUR,
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
      return () => {};
    }

    const handler = setTimeout(() => {
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
            type: Actions.FOREIGN_FOCUSES,
            payload: focuses,
          });
        });
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [id, entities, client, dispatch]);

  // Notify current user focus
  React.useEffect(() => {
    if (!id) {
      return;
    }

    if (focusedEntity) {
      client.mutate({
        mutation: focusMutation,
        variables: {
          id,
          input: {
            entity: convertEntityToInput(focusedEntity.id, focusedEntity.type),
            field: focusedEntity.field,
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
  }, [id, focusedEntity, client]);

  // Ask which entities to listen for focuses
  React.useEffect(() => {
    if (!id) {
      return;
    }

    const toSubscribe = entities.filter(
      entity =>
        entitiesRef.current.findIndex(
          previousEntity => previousEntity.id === entity.id && previousEntity.type === entity.type
        ) === -1
    );
    const toUnsubscribe = entitiesRef.current.filter(
      previousEntity =>
        entities.findIndex(
          entity => previousEntity.id === entity.id && previousEntity.type === entity.type
        ) === -1
    );

    entitiesRef.current = entities;

    if (toSubscribe.length > 0) {
      client.mutate({
        mutation: focusSubscribeMutation,
        variables: {
          id,
          input: {
            entities: toSubscribe.map(({ id: entityId, type: entityType }) =>
              convertEntityToInput(entityId, entityType)
            ),
          },
        },
      });
    }

    if (toUnsubscribe.length > 0) {
      client.mutate({
        mutation: focusUnsubscribeMutation,
        variables: {
          id,
          input: {
            entities: toUnsubscribe.map(({ id: entityId, type: entityType }) =>
              convertEntityToInput(entityId, entityType)
            ),
          },
        },
      });
    }
  }, [id, entities, client]);
};
