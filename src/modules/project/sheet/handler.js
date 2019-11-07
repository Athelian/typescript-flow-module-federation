// @flow
import ApolloClient from 'apollo-client';
import { filterAsync, mapAsync } from 'utils/async';
import type { Action } from 'components/Sheet/SheetState/types';
import { Actions } from 'components/Sheet/SheetState/constants';
import type { EntityEvent, EntityEventHandler } from 'components/Sheet/SheetLive/types';
import { defaultEntityEventChangeTransformer } from 'components/Sheet/SheetLive/entity';
import { newCustomValue } from 'components/Sheet/SheetLive/helper';
import { tagsByIDsQuery } from './query';

export default function entityEventHandler(
  // $FlowFixMe not compatible with hook implementation
  client: ApolloClient,
  dispatch: Action => void
): EntityEventHandler {
  return async (event: EntityEvent /* , projects: Array<Object> */) => {
    switch (event.lifeCycle) {
      case 'Create':
        switch (event.entity.__typename) {
          case 'Milestone': {
            // TODO: handle new milestone
            break;
          }
          case 'Task': {
            // TODO: handle new task
            break;
          }
          default:
            break;
        }
        break;
      case 'Update': {
        let { changes } = event;

        switch (event.entity.__typename) {
          case 'Project':
            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'tags':
                  return client
                    .query({
                      query: tagsByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.tagsByIDs),
                    }));
                default:
                  break;
              }

              return change;
            });
            break;
          case 'Milestone':
            break;
          case 'Task':
            changes = await filterAsync(changes, change => {
              switch (change.field) {
                case 'milestone':
                  // TODO: handle task move from milestone
                  return false;
                default:
                  return true;
              }
            });

            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'tags':
                  return client
                    .query({
                      query: tagsByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.tagsByIDs),
                    }));
                default:
                  break;
              }

              return change;
            });
            break;
          default:
            break;
        }

        if (changes.length > 0) {
          dispatch({
            type: Actions.CHANGE_VALUES,
            payload: {
              changes: changes.map(change => {
                return defaultEntityEventChangeTransformer(event, change);
              }),
            },
          });
        }
        break;
      }
      case 'Delete':
        switch (event.entity.__typename) {
          case 'Milestone':
            // TODO: handle delete milestone
            break;
          case 'Task':
            // TODO: handle delete task
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };
}
