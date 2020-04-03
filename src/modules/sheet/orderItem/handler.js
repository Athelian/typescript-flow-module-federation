// @flow
import { ApolloClient } from 'apollo-client';
import { mapAsync } from 'utils/async';
import { newCustomValue } from 'components/Sheet/SheetLive/helper';
import type { EntityEventChange } from 'components/Sheet/SheetLive/types';
import {
  filesByIDsQuery,
  maskByIDQuery,
  tagsByIDsQuery,
  userByIDQuery,
} from 'modules/sheet/common/query';

export async function handleOrderItemChanges(
  client: ApolloClient<any>,
  changes: Array<EntityEventChange>
): Promise<Array<EntityEventChange>> {
  return mapAsync(changes, change => {
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
      case 'files':
        return client
          .query({
            query: filesByIDsQuery,
            variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
          })
          .then(({ data }) => ({
            field: change.field,
            new: newCustomValue(data.filesByIDs),
          }));
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
      case 'updatedBy':
        if (change.new) {
          return client
            .query({
              query: userByIDQuery,
              variables: { id: change.new?.entity?.id },
            })
            .then(({ data }) => ({
              field: change.field,
              new: newCustomValue(data.user),
            }));
        }
        break;
      default:
        break;
    }

    return change;
  });
}

export default handleOrderItemChanges;
