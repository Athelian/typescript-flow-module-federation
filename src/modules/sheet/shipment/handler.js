/* eslint-disable no-param-reassign */
// @flow
import { ApolloClient } from 'apollo-client';
import type { EntityEventChange } from 'components/Sheet/SheetLive/types';
import { mergeChanges, newCustomValue } from 'components/Sheet/SheetLive/helper';
import { mapAsync } from 'utils/async';
import {
  filesByIDsQuery,
  maskByIDQuery,
  organizationByIDQuery,
  organizationsByIDsQuery,
  tagsByIDsQuery,
  userByIDQuery,
  usersByIDsQuery,
  warehouseByIDQuery,
} from 'modules/sheet/common/query';

export async function handleShipmentChanges(
  client: ApolloClient<any>,
  changes: Array<EntityEventChange>
): Promise<Array<EntityEventChange>> {
  return mapAsync(changes, change => {
    switch (change.field) {
      case 'importer':
      case 'exporter':
        if (change.new) {
          return client
            .query({
              query: organizationByIDQuery,
              variables: { id: change.new?.entity?.id },
            })
            .then(({ data }) => ({
              field: change.field,
              new: newCustomValue(data.organization),
            }));
        }
        break;
      case 'forwarders':
        return client
          .query({
            query: organizationsByIDsQuery,
            variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
          })
          .then(({ data }) => ({
            field: change.field,
            new: newCustomValue(data.organizationsByIDs),
          }));
      case 'transportType':
        if (change.new === null) {
          return change;
        }

        return {
          ...change,
          new: {
            string: change.new?.int === 1 ? 'Sea' : 'Air',
            __typename: 'StringValue',
          },
        };
      case 'inCharges':
        return client
          .query({
            query: usersByIDsQuery,
            variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
          })
          .then(({ data }) => ({
            field: change.field,
            new: newCustomValue(data.usersByIDs),
          }));
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
      default:
        break;
    }

    return change;
  });
}

export function handleVoyageChanges(changes: Array<EntityEventChange>): Array<EntityEventChange> {
  return changes.map(change => {
    switch (change.field) {
      case 'departurePort':
      case 'arrivalPort': {
        return {
          ...change,
          new: {
            custom: {
              seaport: change.new?.string ?? null,
              airport: change.new?.string ?? null,
            },
            __typename: 'CustomValue',
          },
        };
      }
      default:
        return change;
    }
  });
}

export async function handleContainerGroupChanges(
  client: ApolloClient<any>,
  changes: Array<EntityEventChange>
): Promise<Array<EntityEventChange>> {
  return mapAsync(changes, change => {
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
      default:
        break;
    }

    return change;
  });
}

export async function handleTimelineDateChanges(
  client: ApolloClient<any>,
  changes: Array<EntityEventChange>,
  timelineDateId: string,
  shipment: ?Object
): Promise<Array<EntityEventChange>> {
  changes = await mapAsync(changes, change => {
    switch (change.field) {
      case 'approvedBy':
        if (change.new) {
          return client
            .query({
              query: userByIDQuery,
              variables: { id: change.new?.entity?.id },
            })
            .then(({ data }) => ({
              field: 'approvedBy',
              new: newCustomValue(data.user),
            }));
        }
        break;
      case 'assignedTo':
        return client
          .query({
            query: usersByIDsQuery,
            variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
          })
          .then(({ data }) => ({
            field: change.field,
            new: newCustomValue(data.usersByIDs),
          }));
      default:
        break;
    }

    if (shipment) {
      const timelineDate = (() => {
        if (shipment.cargoReady?.id === timelineDateId) {
          return shipment.cargoReady;
        }
        if (shipment.containerGroups[0].customClearance.id === timelineDateId) {
          return shipment.containerGroups[0].customClearance;
        }
        if (shipment.containerGroups[0].warehouseArrival.id === timelineDateId) {
          return shipment.containerGroups[0].warehouseArrival;
        }
        if (shipment.containerGroups[0].deliveryReady.id === timelineDateId) {
          return shipment.containerGroups[0].deliveryReady;
        }

        const voyage = shipment.voyages.find(
          v => v.departure.id === timelineDateId || v.arrival.id === timelineDateId
        );

        if (voyage.departure.id === timelineDateId) {
          return voyage.departure;
        }

        return voyage.arrival;
      })();

      changes = mergeChanges(
        changes,
        {
          approvedBy: (i, v) => ({
            ...i,
            user: v,
          }),
          approvedAt: (i, v) => ({
            ...i,
            date: v,
          }),
        },
        'approved',
        timelineDate.approved
      );
    }

    return change;
  });

  return changes;
}
