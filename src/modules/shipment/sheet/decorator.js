// @flow
import { defaultVolumeMetric } from 'utils/metric';

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

export function decorateContainer(container: Object): Object {
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

export function unDecorateContainer(container: Object): Object {
  return {
    ...container,
    freeTimeStartDate: container?.freeTimeStartDate,
    autoCalculatedFreeTimeStartDate: container?.freeTimeStartDate?.auto ?? false,
    warehouseArrivalAgreedDateApprovedBy: container?.warehouseArrivalAgreedDateApproved?.user,
    warehouseArrivalAgreedDateApprovedAt: container?.warehouseArrivalAgreedDateApproved?.date,
    warehouseArrivalActualDateApprovedBy: container?.warehouseArrivalActualDateApproved?.user,
    warehouseArrivalActualDateApprovedAt: container?.warehouseArrivalActualDateApproved?.date,
    departureDateApprovedBy: container?.departureDateApproved?.user,
    departureDateApprovedAt: container?.departureDateApproved?.date,
    batches: (container?.batches ?? []).map(batch => {
      if (batch.__typename === 'Batch') {
        return unDecorateBatch(batch);
      }

      return batch;
    }),
  };
}

function decorateShipment(shipment: Object): Object {
  return {
    ...shipment,
    totalWeight: {
      value: shipment.totalWeightOverride,
      auto: !shipment.totalWeightOverriding,
      displayMetric: shipment.totalWeightDisplayMetric,
    },
    totalVolume: {
      value: shipment.totalVolumeOverride,
      auto: !shipment.totalVolumeOverriding,
      displayMetric: shipment.totalVolumeDisplayMetric,
    },
    totalPackages: {
      value: shipment.totalPackageQuantityOverride,
      auto: !shipment.totalPackageQuantityOverriding,
    },
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
