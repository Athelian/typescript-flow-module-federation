// @flow
import ApolloClient from 'apollo-client';
import type { Batch, Shipment } from 'generated/graphql';
import normalizeSheetOrderInput from 'modules/sheet/order/normalize';
import normalizeSheetProductInput from 'modules/sheet/product/normalize';
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
import sheetOrderItemMutation from 'modules/sheet/orderItem/mutation';
import sheetBatchMutation from 'modules/sheet/batch/mutation';
import sheetContainerMutation from 'modules/sheet/container/mutation';
import sheetShipmentMutation from 'modules/sheet/shipment/mutation';

const mutations = {
  Order: sheetOrderMutation,
  Product: sheetProductMutation,
  OrderItem: sheetOrderItemMutation,
  Batch: sheetBatchMutation,
  Container: sheetContainerMutation,
  Shipment: sheetShipmentMutation,
  TimelineDate: sheetShipmentMutation,
  Voyage: sheetShipmentMutation,
  ContainerGroup: sheetShipmentMutation,
};

function getShipmentByTimelineDateId(timelineDateId: string, batch: Batch): ?Shipment {
  const { shipment } = batch;
  if (!shipment) return null;

  if (
    shipment.cargoReady.id === timelineDateId ||
    shipment.containerGroups[0].customClearance.id === timelineDateId ||
    shipment.containerGroups[0].warehouseArrival.id === timelineDateId ||
    shipment.containerGroups[0].deliveryReady.id === timelineDateId
  ) {
    return shipment;
  }

  if (
    shipment.voyages.find(
      voyage => voyage.departure.id === timelineDateId || voyage.arrival.id === timelineDateId
    )
  )
    return shipment;

  return null;
}

function getEntityId(entity: Object, batch: Batch): string {
  switch (entity.type) {
    case 'TimelineDate': {
      const shipment = getShipmentByTimelineDateId(entity.id, batch);
      return shipment?.id ?? '';
    }
    case 'Voyage': {
      return batch?.shipment?.id ?? '';
    }
    case 'ContainerGroup': {
      return batch?.shipment?.id ?? '';
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
  batch: Batch
): Object {
  switch (entity.type) {
    case 'Order':
      return normalizeSheetOrderInput(batch.orderItem.order, field, oldValue, newValue);
    case 'Product':
      return normalizeSheetProductInput(
        batch.orderItem.productProvider.product,
        field,
        oldValue,
        newValue
      );
    case 'OrderItem':
      return normalizeSheetOrderItemInput(batch.orderItem, field, oldValue, newValue);
    case 'Batch':
      return normalizeSheetBatchInput(batch, field, oldValue, newValue);
    case 'Shipment':
      return normalizeSheetShipmentInput(batch.shipment, field, oldValue, newValue);
    case 'Container':
      return normalizeSheetContainerInput(batch.container, field, newValue);
    case 'Voyage':
      return normalizeSheetVoyageInput(batch.shipment, entity.id, field, newValue);
    case 'ContainerGroup':
      return normalizeSheetContainerGroupInput(batch.shipment, entity.id, field, newValue);
    case 'TimelineDate': {
      const shipment = getShipmentByTimelineDateId(entity.id, batch);
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
