/* eslint-disable no-param-reassign */
// @flow
import { ApolloClient } from 'apollo-client';
import { mapAsync } from 'utils/async';
import { mergeChanges, newCustomValue } from 'components/Sheet/SheetLive/helper';
import type { EntityEventChange } from 'components/Sheet/SheetLive/types';
import { tagsByIDsQuery, userByIDQuery, warehouseByIDQuery } from 'modules/sheet/common/query';

export async function handleContainerChanges(
  client: ApolloClient<any>,
  changes: Array<EntityEventChange>,
  container: ?Object
): Promise<Array<EntityEventChange>> {
  changes = await mapAsync(changes, change => {
    switch (change.field) {
      case 'warehouse':
        if (change.new) {
          return client
            .query({
              query: warehouseByIDQuery,
              variables: { id: change.new?.entity?.id },
            })
            .then(({ data }) => ({
              field: 'warehouse',
              new: newCustomValue(data.warehouse),
            }));
        }
        break;
      case 'containerOption':
        if (change.new === null) {
          return change;
        }

        return {
          ...change,
          new: {
            string: 'Hanger',
            __typename: 'StringValue',
          },
        };
      case 'warehouseArrivalAgreedDateApprovedBy':
      case 'warehouseArrivalActualDateApprovedBy':
      case 'departureDateApprovedBy':
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

  if (container) {
    changes = mergeChanges(
      changes,
      {
        freeTimeStartDate: (i, v) => ({
          ...i,
          value: v,
        }),
        autoCalculatedFreeTimeStartDate: (i, v) => ({
          ...i,
          auto: v,
        }),
      },
      'freeTimeStartDate',
      container.freeTimeStartDate
    );
    changes = mergeChanges(
      changes,
      {
        warehouseArrivalAgreedDateApprovedBy: (i, v) => ({
          ...i,
          user: v,
        }),
        warehouseArrivalAgreedDateApprovedAt: (i, v) => ({
          ...i,
          date: v,
        }),
      },
      'warehouseArrivalAgreedDateApproved',
      container.warehouseArrivalAgreedDateApproved
    );
    changes = mergeChanges(
      changes,
      {
        warehouseArrivalActualDateApprovedBy: (i, v) => ({
          ...i,
          user: v,
        }),
        warehouseArrivalActualDateApprovedAt: (i, v) => ({
          ...i,
          date: v,
        }),
      },
      'warehouseArrivalActualDateApproved',
      container.warehouseArrivalActualDateApproved
    );
    changes = mergeChanges(
      changes,
      {
        departureDateApprovedBy: (i, v) => ({
          ...i,
          user: v,
        }),
        departureDateApprovedAt: (i, v) => ({
          ...i,
          date: v,
        }),
      },
      'departureDateApproved',
      container.departureDateApproved
    );
  }

  return changes;
}

export default handleContainerChanges;
