// @flow
import { defaultVolumeMetric } from 'utils/metric';

export function decorateContainer(container: Object): Object {
  return {
    ...container,
    freeTimeStartDate: {
      value: container.freeTimeStartDate,
      auto: container?.autoCalculatedFreeTimeStartDate ?? false,
    },
    warehouseArrivalAgreedDateApproved: {
      user: container.warehouseArrivalAgreedDateApprovedBy,
      date: container.warehouseArrivalAgreedDateApprovedAt,
    },
    warehouseArrivalActualDateApproved: {
      user: container.warehouseArrivalActualDateApprovedBy,
      date: container.warehouseArrivalActualDateApprovedAt,
    },
    departureDateApproved: {
      user: container.departureDateApprovedBy,
      date: container.departureDateApprovedAt,
    },
  };
}

export function decorateShipment(shipment: Object): Object {
  return {
    ...shipment,
    cargoReady: {
      ...shipment.cargoReady,
      approved: {
        user: shipment.cargoReady.approvedBy,
        date: shipment.cargoReady.approvedAt,
      },
    },
    containerGroups: shipment.containerGroups.map(containerGroup => ({
      ...containerGroup,
      customClearance: {
        ...containerGroup.customClearance,
        approved: {
          user: containerGroup.customClearance?.approvedBy,
          date: containerGroup.customClearance?.approvedAt,
        },
      },
      warehouseArrival: {
        ...containerGroup.warehouseArrival,
        approved: {
          user: containerGroup.warehouseArrival?.approvedBy,
          date: containerGroup.warehouseArrival?.approvedAt,
        },
      },
      deliveryReady: {
        ...containerGroup.deliveryReady,
        approved: {
          user: containerGroup.deliveryReady?.approvedBy,
          date: containerGroup.deliveryReady?.approvedAt,
        },
      },
    })),
    voyages: shipment.voyages.map(voyage => ({
      ...voyage,
      departure: {
        ...voyage.departure,
        approved: {
          user: voyage?.approvedBy,
          date: voyage?.approvedAt,
        },
      },
      arrival: {
        ...voyage.arrival,
        approved: {
          user: voyage?.approvedBy,
          date: voyage?.approvedAt,
        },
      },
    })),
  };
}

export function decorateBatch(batch: Object): Object {
  return {
    ...batch,
    packageQuantity: {
      value: batch.packageQuantity || 0,
      auto: batch.autoCalculatePackageQuantity || false,
    },
    packageVolume: {
      value: {
        value: batch.packageVolume?.value ?? 0,
        metric: batch.packageVolume?.metric ?? defaultVolumeMetric,
      },
      auto: batch.autoCalculatePackageVolume ?? false,
    },
    shipment: (() => {
      if (!batch.shipment) {
        return null;
      }

      if (batch.shipment.__typename === 'Shipment') {
        return decorateShipment(batch.shipment);
      }

      return batch.shipment;
    })(),
    container: (() => {
      if (!batch.container) {
        return null;
      }

      if (batch.container.__typename === 'Container') {
        return decorateContainer(batch.container);
      }

      return batch.container;
    })(),
  };
}

export function unDecorateBatch(batch: Object): Object {
  return {
    ...batch,
    packageQuantity: batch.packageQuantity.value,
    autoCalculatePackageQuantity: batch.packageQuantity.auto,
    packageVolume: batch.packageVolume.value,
    autoCalculatePackageVolume: batch.packageVolume.auto,
  };
}

export function decorateOrderItem(orderItem: Object): Object {
  return {
    ...orderItem,
    batches: orderItem.batches.map(decorateBatch),
  };
}

function decorateOrder(order: Object): Object {
  return {
    ...order,
    orderItems: order.orderItems.map(decorateOrderItem),
  };
}

export default function decorate(orders: Array<Object>): Array<Object> {
  return orders.map(order => {
    if (order.__typename === 'Order') {
      return decorateOrder(order);
    }

    return order;
  });
}
