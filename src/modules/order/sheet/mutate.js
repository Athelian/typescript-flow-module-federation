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
import sheetOrderMutation from 'modules/sheet/order/mutation';
import sheetOrderItemMutation from 'modules/sheet/orderItem/mutation';
import sheetBatchMutation from 'modules/sheet/batch/mutation';
import sheetContainerMutation from 'modules/sheet/container/mutation';
import sheetShipmentMutation from 'modules/sheet/shipment/mutation';

const mutations = {
  Order: sheetOrderMutation,
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
        voyage => voyage.departure.id === timelineDateId || voyage.arrival.id === timelineDateId
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

function normalizeInput(entity: Object, field: string, value: any, item: Object): Object {
  switch (entity.type) {
    case 'Order':
      switch (field) {
        case 'exporter':
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
                  task?.approvedBy?.organization?.id === item?.exporter?.id
                    ? null
                    : task?.approvedAt,
                approvedById:
                  task?.approvedBy?.organization?.id === item?.exporter?.id
                    ? null
                    : task?.approvedBy?.id,
              })),
            },
          };
        default:
          return normalizeSheetOrderInput(item, field, value);
      }
    case 'OrderItem': {
      const orderItem = item.orderItems.find(oi => oi.id === entity.id);
      if (!orderItem) {
        return {};
      }

      return normalizeSheetOrderItemInput(orderItem, field, value);
    }
    case 'Batch': {
      const batch = item.orderItems
        .map(oi => oi.batches)
        .flat()
        .find(b => b.id === entity.id);
      if (!batch) {
        return {};
      }

      return normalizeSheetBatchInput(batch, field, value);
    }
    case 'Shipment': {
      const shipment = item.orderItems
        .map(oi => oi.batches)
        .flat()
        .map(b => b.shipment)
        .filter(Boolean)
        .find(s => s?.id === entity.id);
      if (!shipment) {
        return {};
      }

      return normalizeSheetShipmentInput(shipment, field, value);
    }
    case 'Container': {
      const container = item.orderItems
        .map(oi => oi.batches)
        .flat()
        .map(b => b.container)
        .filter(Boolean)
        .find(s => s?.id === entity.id);
      if (!container) {
        return {};
      }

      return normalizeSheetContainerInput(container, field, value);
    }
    case 'Voyage': {
      const shipment = getShipmentByVoyageId(entity.id, item);
      if (!shipment) {
        return {};
      }

      return normalizeSheetVoyageInput(shipment, entity.id, field, value);
    }
    case 'ContainerGroup': {
      const shipment = getShipmentByContainerGroupId(entity.id, item);
      if (!shipment) {
        return {};
      }

      return normalizeSheetContainerGroupInput(shipment, entity.id, field, value);
    }
    case 'TimelineDate': {
      const shipment = getShipmentByTimelineDateId(entity.id, item);
      if (!shipment) {
        return {};
      }

      return normalizeSheetTimelineDateInput(shipment, entity.id, field, value);
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
          input: normalizeInput(entity, field, value, item),
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
