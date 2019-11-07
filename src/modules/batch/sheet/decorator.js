/* eslint-disable no-param-reassign */
// @flow
import type { Batch } from 'generated/graphql';
import produce from 'immer';

/**
 * This is used to do clean up the data for cell input
 * Eg: toggle input which combine 2 values
 */
export default function decorate(batches: Array<Batch>): Array<Object> {
  return produce(batches, entities => {
    entities.forEach(batch => {
      batch.packageQuantity = {
        value: batch.packageQuantity || 0,
        auto: batch.autoCalculatePackageQuantity || false,
      };
      if (batch.container) {
        batch.container.freeTimeStartDate = {
          value: batch?.container?.freeTimeStartDate,
          auto: batch?.container?.autoCalculatedFreeTimeStartDate ?? false,
        };
        batch.container.warehouseArrivalAgreedDateApproved = {
          user: batch?.container?.warehouseArrivalAgreedDateApprovedBy,
          date: batch?.container?.warehouseArrivalAgreedDateApprovedAt,
        };
        batch.container.warehouseArrivalActualDateApproved = {
          user: batch?.container?.warehouseArrivalActualDateApprovedBy,
          date: batch?.container?.warehouseArrivalActualDateApprovedAt,
        };
        batch.container.departureDateApproved = {
          user: batch?.container?.departureDateApprovedBy,
          date: batch?.container?.departureDateApprovedAt,
        };
      }

      if (batch.shipment) {
        batch.shipment.cargoReady.approved = {
          user: batch?.shipment?.cargoReady?.approvedBy,
          date: batch?.shipment?.cargoReady?.approvedAt,
        };
        if (batch.shipment?.containerGroups?.length) {
          batch.shipment.containerGroups.forEach(containerGroup => {
            if (containerGroup.customClearance) {
              containerGroup.customClearance.approved = {
                user: containerGroup.customClearance?.approvedBy,
                date: containerGroup.customClearance?.approvedAt,
              };
            }
            if (containerGroup.warehouseArrival) {
              containerGroup.warehouseArrival.approved = {
                user: containerGroup.warehouseArrival?.approvedBy,
                date: containerGroup.warehouseArrival?.approvedAt,
              };
            }
            if (containerGroup.deliveryReady) {
              containerGroup.deliveryReady.approved = {
                user: containerGroup.deliveryReady?.approvedBy,
                date: containerGroup.deliveryReady?.approvedAt,
              };
            }
          });
        }
        if (batch.shipment?.voyages?.length) {
          batch.shipment.voyages.forEach(voyage => {
            if (voyage.departure) {
              voyage.departure.approved = {
                user: voyage.departure?.approvedBy,
                date: voyage.departure?.approvedAt,
              };
            }
            if (voyage.arrival) {
              voyage.arrival.approved = {
                user: voyage.arrival?.approvedBy,
                date: voyage.arrival?.approvedAt,
              };
            }
          });
        }
      }
    });
  });
}
