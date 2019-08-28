// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import logger from 'utils/logger';
import { getByPathWithDefault } from 'utils/fp';
import { useSheetState } from '../SheetState';
import { useSheetLiveID } from './index';
import { convertEntityToInput } from './helper';
import {
  entityEventSubscription,
  entitySubscribeMutation,
  entityUnsubscribeAllMutation,
} from './query';
import { Actions } from '../SheetState/contants';

export const useSheetLiveEntity = () => {
  const id = useSheetLiveID();
  const client = useApolloClient();
  const { state, dispatch } = useSheetState();

  const { entities } = state;

  // Subscribe to entity events
  React.useEffect(() => {
    if (!id) {
      return () => {};
    }

    const subscription = client
      .subscribe({
        query: entityEventSubscription,
        variables: {
          id,
        },
        fetchPolicy: 'no-cache',
      })
      .subscribe({
        next(result) {
          const entityEvent = getByPathWithDefault(null, 'data.data.entityEvent', result);
          if (!entityEvent) {
            return;
          }

          switch (entityEvent.lifeCycle) {
            case 'Create':
              // TODO: find and replace original item
              break;
            case 'Update':
              dispatch({
                type: Actions.CHANGE_VALUES,
                payload: entityEvent.changes
                  .map(change => {
                    let value = null;
                    switch (change.new.__typename) {
                      case 'StringValue':
                        value = change.new.string;
                        break;
                      default:
                        return null;
                    }

                    return {
                      entity: {
                        id: entityEvent.entity.id,
                        type: entityEvent.entity.__typename,
                        field: change.field,
                      },
                      value,
                    };
                  })
                  .filter(c => c !== null),
              });
              break;
            case 'Delete':
              // TODO: find and replace or delete original item
              break;
            default:
              break;
          }
        },
        error: logger.error,
      });

    return () => subscription.unsubscribe();
  }, [client, dispatch, id]);

  // Ask which entities to listen too
  React.useEffect(() => {
    if (!id || entities.length === 0) {
      return () => {};
    }

    client.mutate({
      mutation: entitySubscribeMutation,
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
        mutation: entityUnsubscribeAllMutation,
        variables: {
          id,
        },
      });
    };
  }, [id, entities, client]);
};
