// @flow
import ApolloClient from 'apollo-client';
import type { User } from 'generated/graphql';
import normalizeSheetOrderInput from 'modules/sheet/order/normalize';
import normalizeSheetOrderItemInput from 'modules/sheet/orderItem/normalize';
import normalizeSheetBatchInput from 'modules/sheet/batch/normalize';
import normalizeSheetShipmentInput, {
  normalizeSheetContainerGroupInput,
  normalizeSheetTimelineDateInput,
  normalizeSheetVoyageInput,
} from 'modules/sheet/shipment/normalize';
import normalizeSheetContainerInput from 'modules/sheet/container/normalize';
import normalizeSheetProductInput from 'modules/sheet/product/normalize';
import normalizeSheetProductProviderInput from 'modules/sheet/productProvider/normalize';
import sheetOrderMutation from 'modules/sheet/order/mutation';
import sheetOrderItemMutation from 'modules/sheet/orderItem/mutation';
import sheetBatchMutation from 'modules/sheet/batch/mutation';
import sheetContainerMutation from 'modules/sheet/container/mutation';
import sheetShipmentMutation from 'modules/sheet/shipment/mutation';
import sheetProductMutation from 'modules/sheet/product/mutation';

const mutations = {
  Product: sheetProductMutation,
  Order: sheetOrderMutation,
  OrderItem: sheetOrderItemMutation,
  Batch: sheetBatchMutation,
  Container: sheetContainerMutation,
  Shipment: sheetShipmentMutation,
  TimelineDate: sheetShipmentMutation,
  Voyage: sheetShipmentMutation,
  ContainerGroup: sheetShipmentMutation,
};

const isExporter = (user: User) => (user?.organization?.types ?? []).includes('Exporter');

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
    .filter(user => user?.organization?.id === exporterId || !isExporter(user))
    .map(user => user.id),
  approvedById:
    selectedEntity?.[field]?.approvedBy?.organization?.id !== exporterId &&
    isExporter(selectedEntity?.[field]?.approvedBy)
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

function normalizedInput(
  entity: Object,
  field: string,
  oldValue: any,
  newValue: any,
  shipment: Object
): Object {
  switch (entity.type) {
    case 'Shipment':
      switch (field) {
        case 'exporter': {
          const exporterId = newValue?.id ?? null;
          const inChargeIds = (shipment?.inCharges ?? [])
            .filter(user => user?.organization?.id !== exporterId || !isExporter(user))
            .map(user => user?.id);

          if (exporterId) {
            const batches = [];
            (shipment?.batchesWithoutContainer ?? []).forEach(batch => {
              if (batch?.orderItem?.order?.exporter?.id === exporterId) {
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
                if (batch?.orderItem?.order?.exporter?.id === exporterId) {
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
                id: container.id,
                batches: newBatches,
                representativeBatchIndex: newRepresentativeBatch >= 0 ? newRepresentativeBatch : 0,
              });
            });

            const todo = {
              tasks: (shipment?.todo?.tasks ?? []).map(task => ({
                id: task.id,
                assignedToIds: (task?.assignedTo ?? [])
                  .filter(user => user?.organization?.id === exporterId || !isExporter(user))
                  .map(user => user.id),
                approverIds: (task?.approvers ?? [])
                  .filter(user => user?.organization?.id === exporterId || !isExporter(user))
                  .map(user => user.id),
                inProgressAt:
                  task?.inProgressBy?.organization?.id !== exporterId &&
                  isExporter(task?.inProgressBy)
                    ? null
                    : task?.inProgressAt,
                inProgressById:
                  task?.inProgressBy?.organization?.id !== exporterId &&
                  isExporter(task?.inProgressBy)
                    ? null
                    : task?.inProgressBy?.id,
                completedAt:
                  task?.completedBy?.organization?.id !== exporterId &&
                  isExporter(task?.completedBy)
                    ? null
                    : task?.completedAt,
                completedById:
                  task?.completedBy?.organization?.id !== exporterId &&
                  isExporter(task?.completedBy)
                    ? null
                    : task?.completedBy?.id,
                rejectedAt:
                  task?.rejectedBy?.organization?.id !== exporterId && isExporter(task?.rejectedBy)
                    ? null
                    : task?.rejectedAt,
                rejectedById:
                  task?.rejectedBy?.organization?.id !== exporterId && isExporter(task?.rejectedBy)
                    ? null
                    : task?.rejectedBy?.id,
                approvedAt:
                  task?.approvedBy?.organization?.id !== exporterId && isExporter(task?.approvedBy)
                    ? null
                    : task?.approvedAt,
                approvedById:
                  task?.approvedBy?.organization?.id !== exporterId && isExporter(task?.approvedBy)
                    ? null
                    : task?.approvedBy?.id,
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
        default:
          return normalizeSheetShipmentInput(shipment, field, oldValue, newValue);
      }
    case 'Voyage':
      return normalizeSheetVoyageInput(shipment, entity.id, field, newValue);
    case 'ContainerGroup':
      return normalizeSheetContainerGroupInput(shipment, entity.id, field, newValue);
    case 'TimelineDate':
      return normalizeSheetTimelineDateInput(shipment, entity.id, field, newValue);
    case 'Container': {
      const container = shipment.containers.find(c => c.id === entity.id);
      if (!container) {
        return {};
      }

      return normalizeSheetContainerInput(container, field, newValue);
    }
    case 'Batch': {
      const batch = [
        ...shipment.batchesWithoutContainer,
        ...shipment.containers.flatMap(c => c.batches),
      ].find(b => b.id === entity.id);
      if (!batch) {
        return {};
      }

      return normalizeSheetBatchInput(batch, field, oldValue, newValue);
    }
    case 'OrderItem': {
      const orderItem = [
        ...shipment.batchesWithoutContainer,
        ...shipment.containers.flatMap(c => c.batches),
      ]
        .map(b => b.orderItem)
        .find(oi => oi.id === entity.id);
      if (!orderItem) {
        return {};
      }

      return normalizeSheetOrderItemInput(orderItem, field, oldValue, newValue);
    }
    case 'Order': {
      const order = [
        ...shipment.batchesWithoutContainer,
        ...shipment.containers.flatMap(c => c.batches),
      ]
        .map(b => b.orderItem.order)
        .find(o => o.id === entity.id);
      if (!order) {
        return {};
      }

      return normalizeSheetOrderInput(order, field, oldValue, newValue);
    }
    case 'Product': {
      const product = [
        ...shipment.batchesWithoutContainer,
        ...shipment.containers.flatMap(c => c.batches),
      ]
        .map(b => b.orderItem.productProvider.product)
        .find(o => o.id === entity.id);
      if (!product) {
        return {};
      }

      return normalizeSheetProductInput(product, field, oldValue, newValue);
    }
    case 'ProductProvider': {
      const productProvider = [
        ...shipment.batchesWithoutContainer,
        ...shipment.containers.flatMap(c => c.batches),
      ]
        .map(b => b.orderItem.productProvider)
        .find(o => o.id === entity.id);
      if (!productProvider) {
        return {};
      }

      return normalizeSheetProductProviderInput(productProvider, field, oldValue, newValue);
    }
    default:
      return {
        [field]: newValue,
      };
  }
}

// $FlowFixMe not compatible with hook implementation
export default function(client: ApolloClient) {
  return function mutate({
    entity,
    field,
    oldValue,
    newValue,
    item,
  }: {
    entity: Object,
    field: string,
    oldValue: any,
    newValue: any,
    item: Object,
  }): Promise<Array<Object> | null> {
    return client
      .mutate({
        mutation: mutations[entity.type],
        variables: {
          id: getEntityId(entity, item),
          input: normalizedInput(entity, field, oldValue, newValue, item),
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
