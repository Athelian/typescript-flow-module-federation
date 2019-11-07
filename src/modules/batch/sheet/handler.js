// @flow
import { ApolloClient } from 'apollo-client';
import type { Batch } from 'generated/graphql';
import type { Action } from 'components/Sheet/SheetState/types';
import { Actions } from 'components/Sheet/SheetState/constants';
import type { EntityEvent, EntityEventHandler } from 'components/Sheet/SheetLive/types';
import { defaultEntityEventChangeTransformer } from 'components/Sheet/SheetLive/entity';

export default function entityEventHandler(
  // $FlowFixMe ignore type
  client: ApolloClient,
  dispatch: Action => void
): EntityEventHandler {
  return async (event: EntityEvent, batches: Array<Batch>) => {
    console.warn({ batches });
    switch (event.lifeCycle) {
      case 'Create':
        switch (event.entity.__typename) {
          default:
            break;
        }
        break;
      case 'Update': {
        const { changes } = event;

        switch (event.entity.__typename) {
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
          default:
            break;
        }
        break;
      default:
        break;
    }
  };
}
