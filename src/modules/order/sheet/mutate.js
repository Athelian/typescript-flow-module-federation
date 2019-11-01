// @flow
import ApolloClient from 'apollo-client';
import { removeTypename } from 'utils/data';
import {
  batchMutation,
  containerMutation,
  orderItemMutation,
  orderMutation,
  shipmentMutation,
} from './query';

const mutations = {
  Order: orderMutation,
  OrderItem: orderItemMutation,
  Batch: batchMutation,
  Container: containerMutation,
  Shipment: shipmentMutation,
  TimelineDate: shipmentMutation,
  Voyage: shipmentMutation,
  ContainerGroup: shipmentMutation,
};

function getShipmentByTimelineDateId(timelineDateId: string, item: Object): Object {
  return item.orderItems
    .map(i => i.batches)
    .flat()
    .filter(b => !!b.shipment)
    .map(b => b.shipment)
    .find(shipment => {
      if (
        shipment.cargoReady.id === timelineDateId ||
        shipment.containerGroups[0].customClearance.id === timelineDateId ||
        shipment.containerGroups[0].warehouseArrival.id === timelineDateId ||
        shipment.containerGroups[0].deliveryReady.id === timelineDateId
      ) {
        return true;
      }

      return !!shipment.voyages.find(
        voyage => voyage.departure.id === timelineDateId && voyage.arrival.id === timelineDateId
      );
    });
}

function getShipmentByVoyageId(voyageId: string, item: Object): Object {
  return item.orderItems
    .map(i => i.batches)
    .flat()
    .filter(b => !!b.shipment)
    .map(b => b.shipment)
    .find(shipment => !!shipment.voyages.find(voyage => voyage.id === voyageId));
}

function getShipmentByContainerGroupId(containerGroupId: string, item: Object): Object {
  return item.orderItems
    .map(i => i.batches)
    .flat()
    .filter(b => !!b.shipment)
    .map(b => b.shipment)
    .find(shipment => !!shipment.containerGroups.find(cg => cg.id === containerGroupId));
}

function getEntityId(entity: Object, item: Object): string {
  switch (entity.type) {
    case 'TimelineDate': {
      const shipment = getShipmentByTimelineDateId(entity.id, item);
      return shipment.id;
    }
    case 'Voyage': {
      const shipment = getShipmentByVoyageId(entity.id, item);
      return shipment.id;
    }
    case 'ContainerGroup': {
      const shipment = getShipmentByContainerGroupId(entity.id, item);
      return shipment.id;
    }
    default:
      return entity.id;
  }
}

function normalizedInput(entity: Object, field: string, value: any, item: Object): Object {
  switch (entity.type) {
    case 'Order':
      switch (field) {
        case 'deliveryDate':
        case 'issuedAt':
          return {
            /* $FlowFixMe This comment suppresses an error found when upgrading
             * Flow to v0.111.0. To view the error, delete this comment and run
             * Flow. */
            [field]: new Date(value),
          };
        case 'files':
          return {
            files: value.map(
              ({ __typename, entity: e, path, uploading, progress, ...rest }) => rest
            ),
          };
        case 'tags': {
          return {
            tagIds: value.map(tag => tag.id),
          };
        }
        case 'inCharges':
          return {
            inChargeIds: value.map(user => user.id),
          };
        case 'exporter': {
          return {
            exporterId: value?.id ?? null,
            inChargeIds: (item?.inCharges ?? [])
              .filter(user => user?.organization?.id !== item?.exporter?.id)
              .map(user => user.id),
            orderItems: [],
            todo: {
              ...(item?.todo ?? {}),
              tasks: (item?.todo?.tasks ?? []).map(task => ({
                ...task,
                assignedToIds: (task?.assignedTo ?? [])
                  .filter(user => user?.organization?.id !== item?.exporter?.id)
                  .map(user => user.id),
                approverIds: (task?.approvers ?? [])
                  .filter(user => user?.organization?.id !== item?.exporter?.id)
                  .map(user => user.id),
                inProgressAt:
                  task?.inProgressBy?.organization?.id === item?.exporter?.id
                    ? null
                    : task?.inProgressAt,
                inProgressById:
                  task?.inProgressBy?.organization?.id === item?.exporter?.id
                    ? null
                    : task?.inProgressBy?.id,
                completedAt:
                  task?.completedBy?.organization?.id === item?.exporter?.id
                    ? null
                    : task?.completedAt,
                completedById:
                  task?.completedBy?.organization?.id === item?.exporter?.id
                    ? null
                    : task?.completedBy?.id,
                rejectedAt:
                  task?.rejectedBy?.organization?.id === item?.exporter?.id
                    ? null
                    : task?.rejectedAt,
                rejectedById:
                  task?.rejectedBy?.organization?.id === item?.exporter?.id
                    ? null
                    : task?.rejectedBy?.id,
                approvedAt:
                  task?.approvedAt?.organization?.id === item?.exporter?.id
                    ? null
                    : task?.approvedAt,
                approvedAtId:
                  task?.approvedAt?.organization?.id === item?.exporter?.id
                    ? null
                    : task?.approvedAt?.id,
              })),
            },
          };
        }

        default:
          return {
            [field]: value,
          };
      }
    case 'OrderItem':
      switch (field) {
        case 'price': {
          if (value.value === null) {
            return { price: null };
          }
          return {
            price: {
              amount: value.value,
              currency: value.metric,
            },
          };
        }
        case 'deliveryDate':
          return {
            /* $FlowFixMe This comment suppresses an error found when upgrading
             * Flow to v0.111.0. To view the error, delete this comment and run
             * Flow. */
            [field]: new Date(value),
          };
        case 'tags': {
          return {
            tagIds: value.map(tag => tag.id),
          };
        }
        case 'files':
          return {
            files: value.map(
              ({ __typename, entity: e, path, uploading, progress, ...rest }) => rest
            ),
          };
        default:
          return {
            [field]: value,
          };
      }
    case 'Batch':
      switch (field) {
        case 'desiredAt':
        case 'expiredAt':
        case 'deliveredAt':
        case 'producedAt':
          return {
            /* $FlowFixMe This comment suppresses an error found when upgrading
             * Flow to v0.111.0. To view the error, delete this comment and run
             * Flow. */
            [field]: new Date(value),
          };
        case 'batchQuantityRevisions':
          return {
            batchQuantityRevisions: value.map(({ sort, batch, ...revision }) =>
              removeTypename(revision)
            ),
          };
        case 'packageQuantity': {
          const { auto: autoCalculatePackageQuantity = false, value: packageQuantity = 0 } =
            value || {};
          return {
            autoCalculatePackageQuantity,
            packageQuantity,
          };
        }
        case 'packageGrossWeight':
          return {
            packageGrossWeight: value ? removeTypename(value) : null,
          };
        case 'packageVolume': {
          const { auto: autoCalculatePackageVolume = false, value: packageVolume = 0 } =
            value || {};
          return {
            autoCalculatePackageVolume,
            packageVolume: removeTypename(packageVolume),
          };
        }
        case 'packageSize':
          return {
            packageSize: value ? removeTypename(value) : null,
          };
        case 'tags': {
          return {
            tagIds: value.map(tag => tag.id),
          };
        }
        default:
          return {
            [field]: value,
          };
      }
    case 'Shipment':
      switch (field) {
        case 'blDate':
        case 'bookingDate':
          return {
            /* $FlowFixMe This comment suppresses an error found when upgrading
             * Flow to v0.111.0. To view the error, delete this comment and run
             * Flow. */
            [field]: new Date(value),
          };
        case 'tags': {
          return {
            tagIds: value.map(tag => tag.id),
          };
        }
        case 'files':
          return {
            files: value.map(
              ({ __typename, entity: e, path, uploading, progress, ...rest }) => rest
            ),
          };
        case 'inCharges':
          return {
            inChargeIds: value.map(user => user.id),
          };
        case 'forwarders': {
          return {
            forwarderIds: value.map(({ id }) => id),
          };
        }
        default:
          return {
            [field]: value,
          };
      }
    case 'Container': {
      switch (field) {
        case 'tags': {
          return {
            tagIds: value.map(tag => tag.id),
          };
        }
        case 'warehouseArrivalAgreedDateApproved': {
          return {
            warehouseArrivalAgreedDateApprovedById: value?.user?.id ?? null,
          };
        }
        case 'warehouseArrivalActualDateApproved': {
          return {
            warehouseArrivalActualDateApprovedById: value?.user?.id ?? null,
          };
        }
        case 'departureDateApproved': {
          return {
            departureDateApprovedById: value?.user?.id ?? null,
          };
        }
        case 'freeTimeStartDate': {
          const { auto: autoCalculatedFreeTimeStartDate = false, value: date = null } = value || {};
          return {
            autoCalculatedFreeTimeStartDate,
            freeTimeStartDate: date ? new Date(date) : null,
          };
        }
        case 'warehouseArrivalAgreedDateAssignedTo': {
          return {
            warehouseArrivalAgreedDateAssignedToIds: value.map(user => user.id),
          };
        }
        case 'warehouseArrivalActualDateAssignedTo': {
          return {
            warehouseArrivalActualDateAssignedToIds: value.map(user => user.id),
          };
        }
        case 'warehouse':
          return {
            warehouseId: value?.id ?? null,
          };
        case 'departureDateAssignedTo': {
          return {
            departureDateAssignedToIds: value.map(user => user.id),
          };
        }
        default:
          return {
            [field]: value,
          };
      }
    }
    case 'Voyage': {
      const shipment = getShipmentByVoyageId(entity.id, item);
      if (!shipment) {
        return {};
      }

      const voyageIdx = shipment.voyages.findIndex(v => v.id === entity.id);

      return {
        voyages: shipment.voyages.map((v, idx) => {
          let input = { id: v.id };

          if (v.id === entity.id) {
            input = {
              ...input,
              [field]: value,
            };
          }

          switch (field) {
            case 'departurePort':
              if (voyageIdx > 0 && idx + 1 === voyageIdx) {
                input = {
                  ...input,
                  arrivalPort: value,
                };
              }
              break;
            case 'arrivalPort':
              if (voyageIdx > 0 && idx - 1 === voyageIdx) {
                input = {
                  ...input,
                  departurePort: value,
                };
              }
              break;
            default:
              break;
          }

          return input;
        }),
      };
    }
    case 'ContainerGroup': {
      const shipment = getShipmentByContainerGroupId(entity.id, item);
      if (!shipment) {
        return {};
      }

      return {
        containerGroups: shipment.containerGroups.map(cg => {
          if (cg.id !== entity.id) {
            return { id: cg.id };
          }

          switch (field) {
            case 'warehouse':
              return {
                id: cg.id,
                warehouseId: value?.id ?? null,
              };
            default:
              return {
                id: cg.id,
                [field]: value,
              };
          }
        }),
      };
    }
    case 'TimelineDate': {
      const shipment = getShipmentByTimelineDateId(entity.id, item);
      if (!shipment) {
        return {};
      }

      const input = (() => {
        switch (field) {
          case 'date':
            return {
              date: new Date(value),
            };
          case 'timelineDateRevisions':
            return {
              timelineDateRevisions: value.map(({ sort, date, ...revision }) => ({
                ...removeTypename(revision),
                date: new Date(date),
              })),
            };
          default:
            return {
              [field]: value,
            };
        }
      })();

      if (entity.id === shipment.cargoReady.id) {
        return {
          cargoReady: input,
        };
      }

      if (entity.id === shipment.containerGroups[0].customClearance.id) {
        return {
          containerGroups: [
            {
              customClearance: input,
            },
          ],
        };
      }

      if (entity.id === shipment.containerGroups[0].warehouseArrival.id) {
        return {
          containerGroups: [
            {
              warehouseArrival: input,
            },
          ],
        };
      }

      if (entity.id === shipment.containerGroups[0].deliveryReady.id) {
        return {
          containerGroups: [
            {
              deliveryReady: input,
            },
          ],
        };
      }

      return {
        voyages: shipment.voyages.map(voyage => {
          if (voyage.departure.id === entity.id) {
            return {
              id: voyage.id,
              departure: input,
            };
          }

          if (voyage.arrival.id === entity.id) {
            return {
              id: voyage.id,
              arrival: input,
            };
          }

          return {
            id: voyage.id,
          };
        }),
      };
    }
    default:
      return {
        [field]: value,
      };
  }
}

// $FlowFixMe not compatible with hook implementation
export default function(client: ApolloClient) {
  return function mutate({
    entity,
    field,
    value,
    item,
  }: {
    entity: Object,
    field: string,
    value: any,
    item: Object,
  }): Promise<Array<Object> | null> {
    return client
      .mutate({
        mutation: mutations[entity.type],
        variables: {
          id: getEntityId(entity, item),
          input: normalizedInput(entity, field, value, item),
        },
      })
      .then(({ data }) => {
        const result =
          data?.[`${entity.type.charAt(0).toLowerCase() + entity.type.slice(1)}Update`];

        switch (result?.__typename) {
          case 'Forbidden':
            return [{ message: 'Forbidden' }];
          case 'BadRequest':
            return result?.violations;
          default:
            return null;
        }
      });
  };
}
