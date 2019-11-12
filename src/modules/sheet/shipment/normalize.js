// @flow
import { parseTodoField, removeTypename } from 'utils/data';
import { normalizeSheetInput } from 'modules/sheet/common/normalize';

export default function normalizeSheetShipmentInput(
  shipment: Object,
  field: string,
  value: any
): Object {
  switch (field) {
    case 'blDate':
    case 'bookingDate':
      return {
        [(field: string)]: new Date(value),
      };
    case 'tags':
      return {
        tagIds: value.map(tag => tag.id),
      };
    case 'files':
      return {
        files: value.map(({ __typename, entity: e, path, uploading, progress, ...rest }) => rest),
      };
    case 'inCharges':
      return {
        inChargeIds: value.map(user => user.id),
      };
    case 'forwarders':
      return {
        forwarderIds: value.map(({ id }) => id),
      };
    case 'todo':
      return parseTodoField(null, value);
    default:
      return normalizeSheetInput(shipment, field, value);
  }
}

export function normalizeSheetVoyageInput(
  shipment: Object,
  voyageId: string,
  field: string,
  value: any
): Object {
  const voyageIdx = shipment.voyages.findIndex(v => v.id === voyageId);

  return {
    voyages: shipment.voyages.map((v, idx) => {
      let input = { id: v.id };

      if (v.id === voyageId) {
        input = {
          ...input,
          [field]: value,
        };
      }

      switch (field) {
        case 'departurePort':
          if (voyageIdx > 0 && idx + 1 === voyageIdx) {
            input = {
              ...input,
              arrivalPort: value,
            };
          }
          break;
        case 'arrivalPort':
          if (voyageIdx > 0 && idx - 1 === voyageIdx) {
            input = {
              ...input,
              departurePort: value,
            };
          }
          break;
        default:
          break;
      }

      return input;
    }),
  };
}

export function normalizeSheetContainerGroupInput(
  shipment: Object,
  containerGroupId: string,
  field: string,
  value: any
): Object {
  return {
    containerGroups: shipment.containerGroups.map(cg => {
      if (cg.id !== containerGroupId) {
        return { id: cg.id };
      }

      switch (field) {
        case 'warehouse':
          return {
            id: cg.id,
            warehouseId: value?.id ?? null,
          };
        default:
          return {
            id: cg.id,
            [field]: value,
          };
      }
    }),
  };
}

export function normalizeSheetTimelineDateInput(
  shipment: Object,
  timelineDateId: string,
  field: string,
  value: any
): Object {
  const input = (() => {
    switch (field) {
      case 'date':
        return {
          date: new Date(value),
        };
      case 'assignedTo':
        return { assignedToIds: value.map(user => user?.id) };
      case 'approved':
        return { approvedById: value?.user?.id ?? null };
      case 'timelineDateRevisions':
        return {
          timelineDateRevisions: value.map(({ sort, date, ...revision }) => ({
            ...removeTypename(revision),
            date: new Date(date),
          })),
        };
      default:
        return {
          [field]: value,
        };
    }
  })();

  if (timelineDateId === shipment.cargoReady.id) {
    return {
      cargoReady: input,
    };
  }

  if (timelineDateId === shipment.containerGroups[0].customClearance.id) {
    return {
      containerGroups: [
        {
          customClearance: input,
          id: shipment.containerGroups[0].id,
        },
      ],
    };
  }

  if (timelineDateId === shipment.containerGroups[0].warehouseArrival.id) {
    return {
      containerGroups: [
        {
          warehouseArrival: input,
          id: shipment.containerGroups[0].id,
        },
      ],
    };
  }

  if (timelineDateId === shipment.containerGroups[0].deliveryReady.id) {
    return {
      containerGroups: [
        {
          deliveryReady: input,
          id: shipment.containerGroups[0].id,
        },
      ],
    };
  }

  return {
    voyages: shipment.voyages.map(voyage => {
      if (voyage.departure.id === timelineDateId) {
        return {
          id: voyage.id,
          departure: input,
        };
      }

      if (voyage.arrival.id === timelineDateId) {
        return {
          id: voyage.id,
          arrival: input,
        };
      }

      return {
        id: voyage.id,
      };
    }),
  };
}
