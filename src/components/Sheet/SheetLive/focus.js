// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import logger from 'utils/logger';
import { useSheetState } from '../SheetState';
import { Actions } from '../SheetState/constants';
import { useSheetLiveID } from './index';
import { convertEntityToInput } from './helper';
import {
  blurMutation,
  focusEventSubscription,
  focusMutation,
  focusSubscribeMutation,
  focusUnsubscribeMutation,
} from './query';

export const useSheetLiveFocus = () => {
  const id = useSheetLiveID();
  const client = useApolloClient();
  const { state, dispatch } = useSheetState();
  const [focusedEntity, setFocusedEntity] = React.useState(null);

  const { entities, focusAt } = state;
  const entitiesRef = React.useRef([]);

  React.useEffect(() => {
    let entity = null;
    let field = null;

    if (focusAt) {
      if (focusAt.cell.entity && focusAt.cell.data) {
        entity = focusAt.cell.entity;
        field = focusAt.cell.data.field;
      } else if (focusAt.cell.merged) {
        const parentCell = state.rows[focusAt.cell.merged.from.x][focusAt.cell.merged.from.y];
        if (parentCell.entity && parentCell.data) {
          entity = parentCell.entity;
          field = parentCell.data.field;
        }
      }
    }

    if (entity && field) {
      setFocusedEntity({
        ...entity,
        field,
      });
    } else {
      setFocusedEntity(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusAt]);

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
          const focusEvent = result?.data?.data?.focusEvent;
          if (!focusEvent) {
            return;
          }

          switch (focusEvent.__typename) {
            case 'Focus':
              dispatch({
                type: Actions.FOREIGN_FOCUS,
                payload: {
                  focus: focusEvent,
                },
              });
              break;
            case 'Blur':
              dispatch({
                type: Actions.FOREIGN_BLUR,
                payload: {
                  blur: focusEvent,
                },
              });
              break;
            default:
              break;
          }
        },
        error: logger.error,
      });

    return () => {
      client.mutate({
        mutation: blurMutation,
        variables: {
          id,
        },
      });

      subscription.unsubscribe();
    };
  }, [client, dispatch, id]);

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
      client
        .mutate({
          mutation: focusSubscribeMutation,
          variables: {
            id,
            input: {
              entities: toSubscribe.map(({ id: entityId, type: entityType }) =>
                convertEntityToInput(entityId, entityType)
              ),
            },
          },
        })
        .then(({ data }) => {
          const foreignFocuses = data?.focusSubscribe ?? [];

          if (foreignFocuses.length > 0) {
            dispatch({
              type: Actions.APPEND_FOREIGN_FOCUSES,
              payload: {
                foreignFocuses,
              },
            });
          }
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
  }, [id, entities, client, dispatch]);
};
