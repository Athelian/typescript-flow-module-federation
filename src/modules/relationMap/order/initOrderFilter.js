// @flow
export const initOrderFilter = {
  page: 1,
  perPage: 10,
  filter: {
    query: '',
    archived: false,
  },
  sort: {
    field: 'updatedAt',
    direction: 'DESCENDING',
  },
};

export const initShipmentFilter = {
  page: 1,
  perPage: 10,
  filter: {
    query: '',
  },
  sort: {
    field: 'updatedAt',
    direction: 'DESCENDING',
  },
};

const findRelateShipment = ({
  shipmentId,
  sortShipments,
  clone,
  shipment,
}: {
  shipmentId: string,
  sortShipments: Array<Object>,
  clone: Object,
  shipment: Object,
}) => {
  if (!sortShipments.includes(shipment)) {
    sortShipments.push(shipment);
  }
  if (clone.shipments[shipmentId]) {
    (clone.shipments[shipmentId] || []).forEach(item => {
      sortShipments.push(item);
      if (clone.shipments[item.id]) {
        findRelateShipment({
          shipmentId: item.id,
          shipment: item,
          sortShipments,
          clone,
        });
      }
    });
  }
};

export function manualSortByAction(shipments: Object = {}, state: Object = {}) {
  const sortShipments = [];
  const {
    clone,
    new: { shipments: newShipments = [] },
  } = state;
  for (let counter = newShipments.length - 1; counter >= 0; counter -= 1) {
    const shipmentId = newShipments[counter];
    if (shipments[shipmentId]) {
      sortShipments.push(shipments[shipmentId]);
    }
  }

  Object.entries(shipments || {}).forEach(([shipmentId, shipment]) => {
    findRelateShipment({
      shipmentId,
      shipment,
      clone,
      sortShipments,
    });
  });
  return sortShipments;
}
