// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import logger from 'utils/logger';
import { Mutex } from 'utils/async';
import { useSheetState } from '../SheetState';
import type { Action } from '../SheetState/types';
import { Actions } from '../SheetState/constants';
import type {
  EntityEvent,
  EntityEventChange,
  EntityEventHandlerFactory,
  EntityEventHandler,
} from './types';
import { convertEntityToInput, extractChangeNewValue } from './helper';
import {
  entityEventSubscription,
  entitySubscribeMutation,
  entityUnsubscribeMutation,
} from './query';
import { useSheetLiveID } from './index';

export const defaultEntityEventChangeTransformer = (
  event: EntityEvent,
  change: EntityEventChange
) => ({
  entity: {
    id: event.entity.id,
    type: event.entity.__typename,
  },
  field: change.field,
  value: extractChangeNewValue(change),
});

export const defaultEntityEventHandlerFactory: EntityEventHandlerFactory = (
  dispatch: Action => void
): EntityEventHandler => {
  return (event: EntityEvent) => {
    if (event.lifeCycle !== 'Update') {
      return;
    }

    if (event.changes.length > 0) {
      dispatch({
        type: Actions.CHANGE_VALUES,
        payload: {
          changes: event.changes.map(change => {
            return defaultEntityEventChangeTransformer(event, change);
          }),
        },
      });
    }
  };
};

export const useSheetLiveEntity = (factory: ?EntityEventHandlerFactory) => {
  const id = useSheetLiveID();
  const client = useApolloClient();
  const { state, dispatch } = useSheetState();
  const entityEventHandler: EntityEventHandler = React.useCallback(
    (factory || defaultEntityEventHandlerFactory)(dispatch),
    [dispatch, factory]
  );
  const { entities, items } = state;
  const itemsRef = React.useRef(items);
  const entitiesRef = React.useRef([]);

  React.useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Subscribe to entity events
  React.useEffect(() => {
    if (!id) {
      return () => {};
    }

    const mutex = new Mutex();
    const subscription = client
      // $FlowFixMe Flow typed is not updated yet
      .subscribe({
        query: entityEventSubscription,
        variables: {
          id,
        },
        fetchPolicy: 'no-cache',
      })
      .subscribe({
        next(result) {
          mutex.dispatch(() => {
            const entityEvent = result.data?.data?.entityEvent;
            if (!entityEvent) {
              return null;
            }

            return entityEventHandler(entityEvent, itemsRef.current);
          });
        },
        error: logger.error,
      });

    return () => subscription.unsubscribe();
  }, [client, entityEventHandler, id]);

  // Ask which entities to listen too
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
        mutation: entitySubscribeMutation,
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
        mutation: entityUnsubscribeMutation,
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
