// @flow
import { ApolloClient } from 'apollo-client';
import { mapAsync } from 'utils/async';
import { newCustomValue } from 'components/Sheet/SheetLive/helper';
import type { EntityEventChange } from 'components/Sheet/SheetLive/types';
import { maskByIDQuery } from 'modules/sheet/common/query';

export async function handleProductProviderChanges(
  client: ApolloClient<any>,
  changes: Array<EntityEventChange>
): Promise<Array<EntityEventChange>> {
  return mapAsync(changes, change => {
    switch (change.field) {
      case 'mask':
        if (change.new) {
          return client
            .query({
              query: maskByIDQuery,
              variables: { id: change.new?.entity?.id },
            })
            .then(({ data }) => ({
              field: change.field,
              new: newCustomValue(data.mask),
            }));
        }
        break;
      default:
        break;
    }

    return change;
  });
}

export default handleProductProviderChanges;
