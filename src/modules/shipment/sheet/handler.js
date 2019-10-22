// @flow
import ApolloClient from 'apollo-client';
import type { Action } from 'components/Sheet/SheetState/types';
import { Actions } from 'components/Sheet/SheetState/contants';
import type { EntityEvent, EntityEventHandler } from 'components/Sheet/SheetLive/entity';
import { defaultEntityEventChangeTransformer } from 'components/Sheet/SheetLive/entity';

export default function entityEventHandler(
  // $FlowFixMe not compatible with hook implementation
  client: ApolloClient,
  dispatch: Action => void
): EntityEventHandler {
  return async (event: EntityEvent /* , items: Array<Object> */) => {
    switch (event.lifeCycle) {
      case 'Update': {
        let { changes } = event;

        switch (event.entity.__typename) {
          case 'Shipment': {
            changes = changes.map(change => {
              switch (change.field) {
                case 'transportType':
                  return {
                    ...change,
                    new: {
                      string: change.new?.int === 1 ? 'Air' : 'Sea',
                      __typename: 'StringValue',
                    },
                  };
                default:
                  return change;
              }
            });
            break;
          }
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
      default:
        break;
    }
  };
}
