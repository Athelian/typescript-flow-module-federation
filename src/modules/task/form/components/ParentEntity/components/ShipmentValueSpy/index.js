// @flow
import * as React from 'react';
import type { Shipment, Task } from 'generated/graphql';
import client from 'apollo';
import { getByPath } from 'utils/fp';
import emitter from 'utils/emitter';
import logger from 'utils/logger';
import { shipmentAutoDateQuery } from './query';
import { autoCalculateDate, bindingRelateField } from '../autoCalculateDate';
import { getValueBy } from './helper';
import type { Offset, BindingField, Duration } from '../type.js.flow';

type Props = {
  values: Object,
  inParentEntityForm: boolean,
  task: Object,
  setTaskValue: Function,
};

export const findMappingFields = (voyages: Array<Object>) => ({
  ShipmentBlDate: 'blDate',
  ShipmentBookingDate: 'bookingDate',
  ShipmentCargoReady: 'cargoReady',
  ShipmentLoadPortDeparture: 'voyages.0.departure',
  ShipmentFirstTransitPortArrival: voyages.length > 1 ? 'voyages.0.arrival' : 'shouldNotAvailable',
  ShipmentFirstTransitPortDeparture:
    voyages.length > 1 ? 'voyages.1.departure' : 'shouldNotAvailable',
  ShipmentSecondTransitPortArrival: voyages.length > 2 ? 'voyages.1.arrival' : 'shouldNotAvailable',
  ShipmentSecondTransitPortDeparture:
    voyages.length > 2 ? 'voyages.2.departure' : 'shouldNotAvailable',
  ShipmentDischargePortArrival: `voyages.${voyages.length - 1}.arrival`,
  ShipmentCustomClearance: 'containerGroups.0.customClearance',
  ShipmentWarehouseArrival: 'containerGroups.0.warehouseArrival',
  ShipmentDeliveryReady: 'containerGroups.0.deliveryReady',
  ProjectDueDate: 'milestone.project.dueDate',
  MilestoneDueDate: 'milestone.dueDate',
  TaskStartDate: 'startDate',
  TaskDueDate: 'dueDate',
});

const mappingDate = ({
  field,
  task,
  values,
  mappingFields,
}: {
  field: string,
  task: Task,
  values: Shipment,
  mappingFields: Object,
}) => {
  const path = mappingFields[field] || 'N/A';
  if (field.includes('DueDate') || field.includes('StartDate')) {
    return getValueBy(path, task);
  }

  return getValueBy(path, values);
};

export default function ShipmentValueSpy({
  values,
  task,
  inParentEntityForm,
  setTaskValue,
}: Props) {
  React.useEffect(() => {
    emitter.addListener('FIND_SHIPMENT_VALUE', (bindingData: mixed) => {
      const field = getByPath('field', bindingData);
      const entityId = getByPath('entityId', bindingData);
      const selectedField: BindingField = getByPath('selectedField', bindingData);
      const autoDateDuration: Duration = getByPath('autoDateDuration', bindingData);
      const autoDateOffset: Offset = getByPath('autoDateOffset', bindingData);
      const hasCircleBindingError: boolean = getByPath('hasCircleBindingError', bindingData);
      logger.warn({
        field,
        entityId,
        selectedField,
        autoDateDuration,
        autoDateOffset,
        inParentEntityForm,
        hasCircleBindingError,
      });

      if (hasCircleBindingError) {
        setTaskValue('dueDate', '');
        setTaskValue('startDate', '');
        return;
      }

      const mappingFields = findMappingFields(values.voyages || []);
      if (inParentEntityForm) {
        let date = mappingDate({ field, task, values, mappingFields });
        date = autoCalculateDate({
          autoDateDuration,
          date,
          autoDateOffset,
          field,
          setTaskValue,
          selectedField,
        });
        bindingRelateField({
          selectedField,
          date,
          task,
          setTaskValue,
        });
      } else {
        logger.warn('query order data for id', client);
        // TODO: This flag will be used for showing loading on UI
        emitter.emit('LIVE_VALUE_PROCESS', true);
        client
          .query({
            query: shipmentAutoDateQuery,
            variables: { id: entityId },
            fetchPolicy: 'cache-first',
          })
          .then(({ data }) => {
            emitter.emit('LIVE_VALUE_PROCESS', false);
            let date = mappingDate({
              field,
              task,
              values: data.shipment,
              mappingFields,
            });
            date = autoCalculateDate({
              autoDateDuration,
              date,
              autoDateOffset,
              field,
              setTaskValue,
              selectedField,
            });
            bindingRelateField({
              selectedField,
              task,
              date,
              setTaskValue,
            });
          });
      }
    });

    return () => {
      emitter.removeAllListeners('FIND_SHIPMENT_VALUE');
    };
  });
  return null;
}
