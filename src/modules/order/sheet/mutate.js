// @flow
import ApolloClient from 'apollo-client';
import normalizeSheetOrderInput from 'modules/sheet/order/normalize';
import normalizeSheetProductInput from 'modules/sheet/product/normalize';
import normalizeSheetProductProviderInput from 'modules/sheet/productProvider/normalize';
import normalizeSheetOrderItemInput from 'modules/sheet/orderItem/normalize';
import normalizeSheetBatchInput from 'modules/sheet/batch/normalize';
import normalizeSheetShipmentInput, {
  normalizeSheetContainerGroupInput,
  normalizeSheetTimelineDateInput,
  normalizeSheetVoyageInput,
} from 'modules/sheet/shipment/normalize';
import normalizeSheetContainerInput from 'modules/sheet/container/normalize';
import sheetOrderMutation from 'modules/sheet/order/mutation';
import sheetProductMutation from 'modules/sheet/product/mutation';
import sheetProductProviderMutation from 'modules/sheet/productProvider/mutation';
import sheetOrderItemMutation from 'modules/sheet/orderItem/mutation';
import sheetBatchMutation from 'modules/sheet/batch/mutation';
import sheetContainerMutation from 'modules/sheet/container/mutation';
import sheetShipmentMutation from 'modules/sheet/shipment/mutation';

const mutations = {
  Order: sheetOrderMutation,
  Product: sheetProductMutation,
  ProductProvider: sheetProductProviderMutation,
  OrderItem: sheetOrderItemMutation,
  Batch: sheetBatchMutation,
  Container: sheetContainerMutation,
  Shipment: sheetShipmentMutation,
  TimelineDate: sheetShipmentMutation,
  Voyage: sheetShipmentMutation,
  ContainerGroup: sheetShipmentMutation,
};

function getShipmentByTimelineDateId(timelineDateId: string, item: Object): Object {
  return item.orderItems
    .flatMap(i => i.batches)
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
        voyage => voyage.departure.id === timelineDateId || voyage.arrival.id === timelineDateId
      );
    });
}

function getShipmentByVoyageId(voyageId: string, item: Object): Object {
  return item.orderItems
    .flatMap(i => i.batches)
    .filter(b => !!b.shipment)
    .map(b => b.shipment)
    .find(shipment => !!shipment.voyages.find(voyage => voyage.id === voyageId));
}

function getShipmentByContainerGroupId(containerGroupId: string, item: Object): Object {
  return item.orderItems
    .flatMap(i => i.batches)
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

function normalizeInput(
  entity: Object,
  field: string,
  oldValue: any,
  newValue: any,
  item: Object
): Object {
  switch (entity.type) {
    case 'Order':
      switch (field) {
        case 'exporter':
          return {
            exporterId: newValue?.id ?? null,
            inChargeIds: (item?.inCharges ?? [])
              .filter(user => user?.organization?.id !== item?.exporter?.id)
              .map(user => user.id),
            orderItems: [],
            todo: {
              tasks: (item?.todo?.tasks ?? []).map(
                ({
                  assignedTo,
                  approvers,
                  inProgressAt,
                  inProgressBy,
                  completedAt,
                  completedBy,
                  skippedAt,
                  skippedBy,
                  rejectedAt,
                  rejectedBy,
                  approvedAt,
                  approvedBy,
                }) => ({
                  assignedToIds: (assignedTo ?? [])
                    .filter(user => user?.organization?.id !== item?.exporter?.id)
                    .map(user => user.id),
                  approverIds: (approvers ?? [])
                    .filter(user => user?.organization?.id !== item?.exporter?.id)
                    .map(user => user.id),
                  inProgressAt:
                    inProgressBy?.organization?.id === item?.exporter?.id ? null : inProgressAt,
                  inProgressById:
                    inProgressBy?.organization?.id === item?.exporter?.id ? null : inProgressBy?.id,
                  completedAt:
                    completedBy?.organization?.id === item?.exporter?.id ? null : completedAt,
                  completedById:
                    completedBy?.organization?.id === item?.exporter?.id ? null : completedBy?.id,
                  skippedAt: skippedBy?.organization?.id === item?.exporter?.id ? null : skippedAt,
                  skippedById:
                    skippedBy?.organization?.id === item?.exporter?.id ? null : skippedBy?.id,
                  rejectedAt:
                    rejectedBy?.organization?.id === item?.exporter?.id ? null : rejectedAt,
                  rejectedById:
                    rejectedBy?.organization?.id === item?.exporter?.id ? null : rejectedBy?.id,
                  approvedAt:
                    approvedBy?.organization?.id === item?.exporter?.id ? null : approvedAt,
                  approvedById:
                    approvedBy?.organization?.id === item?.exporter?.id ? null : approvedBy?.id,
                })
              ),
            },
          };
        default:
          return normalizeSheetOrderInput(item, field, oldValue, newValue);
      }
    case 'Product': {
      const product = item.orderItems
        .map(oi => oi.productProvider.product)
        .find(p => p.id === entity.id);
      if (!product) {
        return {};
      }

      return normalizeSheetProductInput(product, field, oldValue, newValue);
    }
    case 'ProductProvider': {
      const productProvider = item.orderItems
        .map(oi => oi.productProvider)
        .find(p => p.id === entity.id);
      if (!productProvider) {
        return {};
      }

      return normalizeSheetProductProviderInput(productProvider, field, oldValue, newValue);
    }
    case 'OrderItem': {
      const orderItem = item.orderItems.find(oi => oi.id === entity.id);
      if (!orderItem) {
        return {};
      }

      return normalizeSheetOrderItemInput(orderItem, field, oldValue, newValue);
    }
    case 'Batch': {
      const batch = item.orderItems.flatMap(oi => oi.batches).find(b => b.id === entity.id);
      if (!batch) {
        return {};
      }

      return normalizeSheetBatchInput(batch, field, oldValue, newValue);
    }
    case 'Shipment': {
      const shipment = item.orderItems
        .flatMap(oi => oi.batches)
        .map(b => b.shipment)
        .filter(Boolean)
        .find(s => s?.id === entity.id);
      if (!shipment) {
        return {};
      }

      return normalizeSheetShipmentInput(shipment, field, oldValue, newValue);
    }
    case 'Container': {
      const container = item.orderItems
        .flatMap(oi => oi.batches)
        .map(b => b.container)
        .filter(Boolean)
        .find(s => s?.id === entity.id);
      if (!container) {
        return {};
      }

      return normalizeSheetContainerInput(container, field, newValue);
    }
    case 'Voyage': {
      const shipment = getShipmentByVoyageId(entity.id, item);
      if (!shipment) {
        return {};
      }

      return normalizeSheetVoyageInput(shipment, entity.id, field, newValue);
    }
    case 'ContainerGroup': {
      const shipment = getShipmentByContainerGroupId(entity.id, item);
      if (!shipment) {
        return {};
      }

      return normalizeSheetContainerGroupInput(shipment, entity.id, field, newValue);
    }
    case 'TimelineDate': {
      const shipment = getShipmentByTimelineDateId(entity.id, item);
      if (!shipment) {
        return {};
      }

      return normalizeSheetTimelineDateInput(shipment, entity.id, field, newValue);
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
          input: normalizeInput(entity, field, oldValue, newValue, item),
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
