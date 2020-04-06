// @flow
import { ApolloClient } from 'apollo-client';
import { mapAsync } from 'utils/async';
import { newCustomValue } from 'components/Sheet/SheetLive/helper';
import type { EntityEventChange } from 'components/Sheet/SheetLive/types';
import { tagsByIDsQuery, userByIDQuery } from 'modules/sheet/common/query';
import { milestoneByIDQuery } from './query';

export async function handleTaskChanges(
  client: ApolloClient<any>,
  changes: Array<EntityEventChange>
): Promise<Array<EntityEventChange>> {
  return mapAsync(changes, change => {
    switch (change.field) {
      case 'inProgressBy':
      case 'skippedBy':
      case 'completedBy':
      case 'rejectedBy':
      case 'approvedBy':
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
      case 'milestone':
        if (change.new) {
          return client
            .query({
              query: milestoneByIDQuery,
              variables: { id: change.new?.entity?.id },
            })
            .then(({ data }) => ({
              field: change.field,
              new: newCustomValue(data.milestone),
            }));
        }
        break;
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
}

export default handleTaskChanges;
