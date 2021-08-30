// @flow
import type { Shipment } from 'generated/graphql';
import { parseFilesField, parseTodoField, removeTypename, parseTagsField } from 'utils/data';
import { normalizeSheetInput } from 'modules/sheet/common/normalize';

const cleanUpPorts = (shipment: Shipment) => {
  return {
    voyages: (shipment?.voyages ?? []).map(voyage => ({
      id: voyage.id,
      arrivalPort: null,
      departurePort: null,
    })),
  };
};

export default function normalizeSheetShipmentInput(
  shipment: Object,
  field: string,
  oldValue: any,
  newValue: any
): Object {
  switch (field) {
    case 'followers':
      return {
        followerIds: newValue.map(follower => follower.id),
      };
    case 'transportType':
      return {
        transportType: newValue,
        ...cleanUpPorts(shipment),
      };
    case 'blDate':
    case 'bookingDate':
      return {
        [(field: string)]: newValue || null,
      };
    case 'tags':
      return parseTagsField('tags', oldValue, newValue);
    case 'files': {
      const newFiles = parseFilesField({
        key: 'files',
        originalFiles: oldValue,
        newFiles: newValue,
        isNewFormat: true,
      });

      return newFiles;
    }
    case 'totalVolume':
      return {
        totalVolumeOverride: newValue.value ? removeTypename(newValue.value) : null,
        totalVolumeOverriding: !newValue.auto,
        totalVolumeDisplayMetric: newValue.displayMetric,
      };
    case 'totalWeight':
      return {
        totalWeightOverride: newValue.value ? removeTypename(newValue.value) : null,
        totalWeightOverriding: !newValue.auto,
        totalWeightDisplayMetric: newValue.displayMetric,
      };
    case 'totalPackages':
      return {
        totalPackageQuantityOverride: newValue.value,
        totalPackageQuantityOverriding: !newValue.auto,
      };
    case 'todo': {
      return parseTodoField(removeTypename(oldValue), removeTypename(newValue));
    }
    case 'mask':
      return {
        customFields: {
          maskId: newValue?.id ?? null,
        },
      };
    default:
      return normalizeSheetInput(shipment, field, newValue);
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
          date: value || null,
        };
      case 'approved':
        return { approvedById: value?.user?.id ?? null };
      case 'timelineDateRevisions':
        return {
          timelineDateRevisions: value.map(({ sort, date, ...revision }) => ({
            ...removeTypename(revision),
            date: date || null,
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
