// @flow
import ApolloClient from 'apollo-client';
import { parseTodoField, removeTypename } from 'utils/data';
import {
  batchMutation,
  containerMutation,
  orderItemMutation,
  orderMutation,
  shipmentMutation,
} from './query';

const mutations = {
  Shipment: shipmentMutation,
  Container: containerMutation,
  TimelineDate: shipmentMutation,
  Batch: batchMutation,
  OrderItem: orderItemMutation,
  Order: orderMutation,
};

const cleanUpExporter = ({
  selectedEntity,
  field,
  exporterId,
}: {
  selectedEntity: Object,
  field: string,
  exporterId: string,
}) => ({
  assignedToIds: (selectedEntity?.[field]?.assignedTo ?? [])
    .filter(user => user?.organization?.id !== exporterId)
    .map(user => user.id),
  approvedAt:
    selectedEntity?.[field]?.approvedBy?.organization?.id === exporterId
      ? null
      : selectedEntity?.[field]?.approvedAt,
  approvedById:
    selectedEntity?.[field]?.approvedBy?.organization?.id === exporterId
      ? null
      : selectedEntity?.[field]?.approvedBy?.id,
});

function getEntityId(entity: Object, item: Object): string {
  switch (entity.type) {
    case 'TimelineDate': {
      return item.id;
    }
    default:
      return entity.id;
  }
}

function normalizedInput(entity: Object, field: string, value: any, shipment: Object): Object {
  switch (entity.type) {
    case 'Shipment':
      switch (field) {
        case 'blDate':
        case 'bookingDate':
          return {
            [(field: string)]: new Date(value),
          };
        case 'tags':
          return {
            tagIds: value.map(tag => tag.id),
          };
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
        case 'exporter': {
          const exporterId = value?.id ?? null;
          const inChargeIds = (shipment?.inCharges ?? [])
            .filter(user => user?.organization?.id !== exporterId)
            .map(user => user?.id);

          if (exporterId) {
            const batches = [];
            (shipment?.batchesWithoutContainer ?? []).forEach(batch => {
              if (batch?.orderItem?.order?.exporter?.id !== exporterId) {
                batches.push({
                  id: batch?.id,
                });
              }
            });
            const containers = [];
            (shipment?.containers ?? []).forEach(container => {
              const { representativeBatch } = container;
              const newBatches = [];
              (container?.batches ?? []).forEach(batch => {
                if (batch?.orderItem?.order?.exporter?.id !== exporterId) {
                  newBatches.push({
                    id: batch?.id,
                  });
                  batches.push({
                    id: batch?.id,
                  });
                }
              });
              const newRepresentativeBatch = newBatches
                .map(batch => batch.id)
                .indexOf(representativeBatch?.id);
              containers.push({
                batches: newBatches,
                representativeBatchIndex: newRepresentativeBatch >= 0 ? newRepresentativeBatch : 0,
              });
            });

            const todo = {
              tasks: (shipment?.todo?.tasks ?? []).map(task => ({
                id: task.id,
                assignedToIds: (task?.assignedTo ?? [])
                  .filter(user => user?.organization?.id !== exporterId)
                  .map(user => user.id),
                approverIds: (task?.approvers ?? [])
                  .filter(user => user?.organization?.id !== exporterId)
                  .map(user => user.id),
                inProgressAt:
                  task?.inProgressBy?.organization?.id === exporterId ? null : task?.inProgressAt,
                inProgressById:
                  task?.inProgressBy?.organization?.id === exporterId
                    ? null
                    : task?.inProgressBy?.id,
                completedAt:
                  task?.completedBy?.organization?.id === exporterId ? null : task?.completedAt,
                completedById:
                  task?.completedBy?.organization?.id === exporterId ? null : task?.completedBy?.id,
                rejectedAt:
                  task?.rejectedBy?.organization?.id === exporterId ? null : task?.rejectedAt,
                rejectedById:
                  task?.rejectedBy?.organization?.id === exporterId ? null : task?.rejectedBy?.id,
                approvedAt:
                  task?.approvedBy?.organization?.id === exporterId ? null : task?.approvedAt,
                approvedById:
                  task?.approvedBy?.organization?.id === exporterId ? null : task?.approvedAt?.id,
              })),
            };

            const cargoReady = cleanUpExporter({
              selectedEntity: shipment,
              field: 'cargoReady',
              exporterId,
            });

            const voyages = (shipment?.voyages ?? []).map(voyage => ({
              id: voyage.id,
              arrival: cleanUpExporter({ selectedEntity: voyage, field: 'arrival', exporterId }),
              departure: cleanUpExporter({
                selectedEntity: voyage,
                field: 'departure',
                exporterId,
              }),
            }));

            const containerGroups = (shipment?.containerGroups ?? []).map(group => ({
              id: group.id,
              customClearance: cleanUpExporter({
                selectedEntity: group,
                field: 'customClearance',
                exporterId,
              }),
              warehouseArrival: cleanUpExporter({
                selectedEntity: group,
                field: 'warehouseArrival',
                exporterId,
              }),
              deliveryReady: cleanUpExporter({
                selectedEntity: group,
                field: 'deliveryReady',
                exporterId,
              }),
            }));
            return {
              exporterId,
              inChargeIds,
              batches,
              containers,
              cargoReady,
              voyages,
              containerGroups,
              todo,
            };
          }
          return {
            exporterId,
            inChargeIds,
          };
        }
        case 'forwarders':
          return {
            forwarderIds: value.map(({ id }) => id),
          };
        case 'todo':
          return parseTodoField(null, value);
        default:
          return {
            [field]: value,
          };
      }
    case 'Voyage': {
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
    case 'ContainerGroup':
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
    case 'TimelineDate': {
      const input = (() => {
        switch (field) {
          case 'date':
            return {
              date: new Date(value),
            };
          case 'assignedTo':
            return { assignedToIds: value.map(user => user?.id) };
          case 'approved':
            return { approvedById: value?.user?.id ?? null };
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
              id: shipment.containerGroups[0].id,
            },
          ],
        };
      }

      if (entity.id === shipment.containerGroups[0].warehouseArrival.id) {
        return {
          containerGroups: [
            {
              warehouseArrival: input,
              id: shipment.containerGroups[0].id,
            },
          ],
        };
      }

      if (entity.id === shipment.containerGroups[0].deliveryReady.id) {
        return {
          containerGroups: [
            {
              deliveryReady: input,
              id: shipment.containerGroups[0].id,
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
    case 'Container': {
      switch (field) {
        case 'tags':
          return {
            tagIds: value.map(tag => tag.id),
          };
        case 'warehouseArrivalAgreedDateApproved':
          return {
            warehouseArrivalAgreedDateApprovedById: value?.user?.id ?? null,
          };
        case 'warehouseArrivalActualDateApproved':
          return {
            warehouseArrivalActualDateApprovedById: value?.user?.id ?? null,
          };
        case 'departureDateApproved':
          return {
            departureDateApprovedById: value?.user?.id ?? null,
          };
        case 'freeTimeStartDate': {
          const { auto: autoCalculatedFreeTimeStartDate = false, value: date = null } = value || {};
          return {
            autoCalculatedFreeTimeStartDate,
            freeTimeStartDate: date ? new Date(date) : null,
          };
        }
        case 'warehouseArrivalAgreedDateAssignedTo':
          return {
            warehouseArrivalAgreedDateAssignedToIds: value.map(user => user.id),
          };
        case 'warehouseArrivalActualDateAssignedTo':
          return {
            warehouseArrivalActualDateAssignedToIds: value.map(user => user.id),
          };
        case 'warehouse':
          return {
            warehouseId: value?.id ?? null,
          };
        case 'departureDateAssignedTo':
          return {
            departureDateAssignedToIds: value.map(user => user.id),
          };
        default:
          return {
            [field]: value,
          };
      }
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
        case 'tags':
          return {
            tagIds: value.map(tag => tag.id),
          };
        case 'todo':
          return parseTodoField(null, value);
        default:
          return {
            [field]: value,
          };
      }
    case 'OrderItem':
      switch (field) {
        case 'price':
          if (value.value === null) {
            return { price: null };
          }
          return {
            price: {
              amount: value.value,
              currency: value.metric,
            },
          };
        case 'deliveryDate':
          return {
            /* $FlowFixMe This comment suppresses an error found when upgrading
             * Flow to v0.111.0. To view the error, delete this comment and run
             * Flow. */
            [field]: new Date(value),
          };
        case 'tags':
          return {
            tagIds: value.map(tag => tag.id),
          };
        case 'files':
          return {
            files: value.map(
              ({ __typename, entity: e, path, uploading, progress, ...rest }) => rest
            ),
          };
        case 'todo':
          return parseTodoField(null, value);
        default:
          return {
            [field]: value,
          };
      }
    case 'Order':
      switch (field) {
        case 'deliveryDate':
        case 'issuedAt':
          return {
            [(field: string)]: new Date(value),
          };
        case 'files':
          return {
            files: value.map(
              ({ __typename, entity: e, path, uploading, progress, ...rest }) => rest
            ),
          };
        case 'tags':
          return {
            tagIds: value.map(tag => tag.id),
          };
        case 'inCharges':
          return {
            inChargeIds: value.map(user => user.id),
          };
        case 'todo':
          return parseTodoField(null, value);
        default:
          return {
            [field]: value,
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
