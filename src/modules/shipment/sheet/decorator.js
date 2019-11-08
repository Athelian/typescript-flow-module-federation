// @flow

function decorateBatch(batch: Object): Object {
  return {
    ...batch,
    packageQuantity: {
      value: batch.packageQuantity || 0,
      auto: batch.autoCalculatePackageQuantity || false,
    },
  };
}

function decorateContainer(container: Object): Object {
  return {
    ...container,
    freeTimeStartDate: {
      value: container.freeTimeStartDate,
      auto: container.autoCalculatedFreeTimeStartDate ?? false,
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
    batches: container.batches.map(batch => {
      if (batch.__typename === 'Batch') {
        return decorateBatch(batch);
      }

      return batch;
    }),
  };
}

function decorateShipment(shipment: Object): Object {
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
          user: containerGroup.customClearance.approvedBy,
          date: containerGroup.customClearance.approvedAt,
        },
      },
      warehouseArrival: {
        ...containerGroup.warehouseArrival,
        approved: {
          user: containerGroup.warehouseArrival.approvedBy,
          date: containerGroup.warehouseArrival.approvedAt,
        },
      },
      deliveryReady: {
        ...containerGroup.deliveryReady,
        approved: {
          user: containerGroup.deliveryReady.approvedBy,
          date: containerGroup.deliveryReady.approvedAt,
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
    batchesWithoutContainer: shipment.batchesWithoutContainer.map(batch => {
      if (batch.__typename === 'Batch') {
        return decorateBatch(batch);
      }

      return batch;
    }),
    containers: shipment.containers.map(decorateContainer),
  };
}

export default function decorate(shipments: Array<Object>): Array<Object> {
  return shipments.map(shipment => {
    if (shipment.__typename === 'Shipment') {
      return decorateShipment(shipment);
    }

    return shipment;
  });
}
