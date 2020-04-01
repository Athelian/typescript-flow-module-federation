// @flow
import ApolloClient from 'apollo-client';
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
import sheetProductProviderMutation from 'modules/sheet/productProvider/mutation';

const mutations = {
  Product: sheetProductMutation,
  ProductProvider: sheetProductProviderMutation,
  Order: sheetOrderMutation,
  OrderItem: sheetOrderItemMutation,
  Batch: sheetBatchMutation,
  Container: sheetContainerMutation,
  Shipment: sheetShipmentMutation,
  TimelineDate: sheetShipmentMutation,
  Voyage: sheetShipmentMutation,
  ContainerGroup: sheetShipmentMutation,
};

function getEntityId(entity: Object, item: Object): string {
  switch (entity.type) {
    case 'TimelineDate': {
      return item.id;
    }
    case 'Voyage': {
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
          // When exporter was null:
          if (!oldValue) {
            // Remove batches from shipment that dont belong to new exporter
            const cleanedBatches = (shipment?.batchesWithoutContainer ?? [])
              .filter(batch => batch?.orderItem?.order?.exporter?.id === newValue?.id)
              .map(batch => ({
                id: batch?.id,
              }));

            // Remove batches from containers that dont belong to new exporter
            const cleanedContainers = (shipment?.containers ?? []).map(container => {
              const cleanedContainerBatches = (container?.batches ?? [])
                .filter(batch => batch?.orderItem?.order?.exporter?.id === newValue?.id)
                .map(batch => ({
                  id: batch?.id,
                }));

              // Need to update representativeBatch if it was removed
              const representativeBatchIndex = cleanedContainerBatches
                .map(batch => batch.id)
                .indexOf(container?.representativeBatch?.id);

              return {
                id: container.id,
                batches: cleanedContainerBatches,
                representativeBatchIndex:
                  representativeBatchIndex >= 0 ? representativeBatchIndex : 0,
              };
            });

            return {
              exporterId: newValue?.id,
              batches: cleanedBatches,
              containers: cleanedContainers,
            };
          }
          // When exporter was not null:
          // Remove followers from shipment of previous exporter
          const cleanedFollowers = (shipment?.followers ?? [])
            .filter(follower => follower?.organization?.id !== oldValue?.id)
            .map(follower => follower?.id);

          // When remove exporter:
          if (!newValue) {
            // Remove followers from batches of shipment of previous exporter
            const cleanedBatches = (shipment?.batchesWithoutContainer ?? []).map(batch => {
              return {
                id: batch?.id,
              };
            });

            // Remove followers from containers of previous exporter and followers from batches of containers of previous exporter
            const cleanedContainers = (shipment?.containers ?? []).map(container => {
              const cleanedContainerBatches = (container?.batches ?? []).map(batch => {
                return {
                  id: batch?.id,
                };
              });

              return {
                id: container.id,
                batches: cleanedContainerBatches,
              };
            });

            return {
              exporterId: null,
              followerIds: cleanedFollowers,
              batches: cleanedBatches,
              containers: cleanedContainers,
            };
          }
          // When change exporter:
          // Remove all batches from shipment
          const cleanedBatches = [];

          // Remove followers from containers of previous exporter and all batches from containers
          const cleanedContainers = (shipment?.containers ?? []).map(container => {
            const containerBatches = [];

            const representativeBatchIndex = null;

            return {
              id: container.id,
              batches: containerBatches,
              representativeBatchIndex,
            };
          });

          return {
            exporterId: newValue?.id,
            followerIds: cleanedFollowers,
            batches: cleanedBatches,
            containers: cleanedContainers,
          };
        }
        case 'forwarders': {
          const removedForwarders = (oldValue ?? []).filter(
            prevForwarder =>
              !(newValue ?? []).some(newForwarder => newForwarder.id === prevForwarder.id)
          );

          // Remove followers from shipment of removed forwarders
          const cleanedFollowers = (shipment?.followers ?? [])
            .filter(
              follower =>
                !removedForwarders.some(
                  removedForwarder => removedForwarder.id === follower?.organization?.id
                )
            )
            .map(follower => follower?.id);

          // Remove followers from batches of removed forwarders
          const cleanedBatches = (shipment?.batchesWithoutContainer ?? []).map(batch => {
            return {
              id: batch?.id,
            };
          });

          // Remove followers from containers of removed forwarders and followers from batches of containers of removed forwarders
          const cleanedContainers = (shipment?.containers ?? []).map(container => {
            const cleanedContainerBatches = (shipment?.batchesWithoutContainer ?? []).map(batch => {
              return {
                id: batch?.id,
              };
            });

            return {
              id: container?.id,
              batches: cleanedContainerBatches,
            };
          });

          return {
            forwarderIds: newValue.map(forwarder => forwarder?.id),
            followerIds: cleanedFollowers,
            batches: cleanedBatches,
            containers: cleanedContainers,
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
