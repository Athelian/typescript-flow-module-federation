// @flow

/**
 * This is used to do clean up the data for cell input
 * Eg: toggle input which combine 2 values
 */
export default function decorate(orders: Array<Object>): Array<Object> {
  return orders.map(order => ({
    ...order,
    orderItems: order.orderItems.map(orderItem => ({
      ...orderItem,
      batches: orderItem.batches.map(batch => ({
        ...batch,
        // TODO: consider to rename this field
        packageQuantity: {
          value: batch.packageQuantity || 0,
          auto: batch.autoCalculatePackageQuantity || false,
        },
        shipment: batch?.shipment
          ? {
              ...batch?.shipment,
              cargoReady: batch?.shipment?.cargoReady
                ? {
                    ...batch?.shipment?.cargoReady,
                    approved: {
                      user: batch?.shipment?.cargoReady?.approvedBy,
                      date: batch?.shipment?.cargoReady?.approvedAt,
                    },
                  }
                : null,
              containerGroups: (batch?.shipment?.containerGroups ?? []).map(containerGroup => ({
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
              voyages: (batch?.shipment?.voyages ?? []).map(voyage => ({
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
            }
          : null,
        container: batch?.container
          ? {
              ...batch?.container,
              // TODO: consider to rename this field
              freeTimeStartDate: {
                value: batch?.container?.freeTimeStartDate,
                auto: batch?.container?.autoCalculatedFreeTimeStartDate ?? false,
              },
              warehouseArrivalAgreedDateApproved: {
                user: batch?.container?.warehouseArrivalAgreedDateApprovedBy,
                date: batch?.container?.warehouseArrivalAgreedDateApprovedAt,
              },
              warehouseArrivalActualDateApproved: {
                user: batch?.container?.warehouseArrivalActualDateApprovedBy,
                date: batch?.container?.warehouseArrivalActualDateApprovedAt,
              },
              departureDateApproved: {
                user: batch?.container?.departureDateApprovedBy,
                date: batch?.container?.departureDateApprovedAt,
              },
            }
          : null,
      })),
    })),
  }));
}
