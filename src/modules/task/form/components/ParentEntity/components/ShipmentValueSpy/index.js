// @flow
import * as React from 'react';
import type { Shipment, Task } from 'generated/graphql';
import client from 'apollo';
import emitter from 'utils/emitter';
import logger from 'utils/logger';
import { START_DATE } from 'modules/task/form/components/TaskInfoSection/constants';
import { calculateDate, findDuration } from 'modules/task/form/components/TaskInfoSection/helpers';
import { shipmentAutoDateQuery } from './query';
import { getValueBy } from './helper';

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
  if (path.includes('milestone')) {
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
    emitter.addListener(
      'FIND_SHIPMENT_VALUE',
      async ({
        field,
        entityId,
        selectedField,
        autoDateDuration,
        autoDateOffset,
      }: {
        field: string,
        entityId: string,
        selectedField: string,
        autoDateDuration?: Object,
        autoDateOffset?: Object,
      }) => {
        logger.warn({
          field,
          entityId,
          selectedField,
        });

        const mappingFields = findMappingFields(values.voyages || []);
        if (inParentEntityForm) {
          let date = mappingDate({ mappingFields, field, task, values });
          if (autoDateDuration) {
            date = calculateDate({
              date,
              duration: autoDateDuration.metric,
              offset: autoDateOffset === 'after' ? autoDateDuration.value : -autoDateDuration.value,
            });
          }
          if (field !== START_DATE) {
            setTaskValue(selectedField, date);
            emitter.emit('LIVE_VALUE', field, date);
          } else {
            setTaskValue(
              selectedField,
              autoDateDuration
                ? calculateDate({
                    date: task.startDate,
                    duration: autoDateDuration.metric,
                    offset:
                      autoDateOffset === 'after' ? autoDateDuration.value : -autoDateDuration.value,
                  })
                : task.startDate
            );
          }

          // we need to set the due date if those field are binding together
          if (selectedField === 'startDate') {
            if (task.dueDateBinding === START_DATE) {
              const { weeks, months, days } = task.dueDateInterval || {};
              setTaskValue(
                'dueDate',
                calculateDate({
                  date,
                  duration: findDuration({ weeks, months }),
                  offset: weeks || months || days,
                })
              );
            }
          }
        } else {
          logger.warn('query shipment data for id', client);
          // TODO: This flag will be used for showing loading on UI
          emitter.emit('LIVE_VALUE_PROCESS', true);
          const { data } = await client.query({
            query: shipmentAutoDateQuery,
            variables: { id: entityId },
            fetchPolicy: 'cache-first',
          });
          emitter.emit('LIVE_VALUE_PROCESS', false);

          let date = mappingDate({ mappingFields, field, task, values: data.shipment });
          if (autoDateDuration) {
            date = calculateDate({
              date,
              duration: autoDateDuration.metric,
              offset: autoDateOffset === 'after' ? autoDateDuration.value : -autoDateDuration.value,
            });
          }

          if (field !== START_DATE) {
            setTaskValue(selectedField, date);
            emitter.emit('LIVE_VALUE', field, date);
          } else {
            setTaskValue(
              selectedField,
              autoDateDuration
                ? calculateDate({
                    date: task.startDate,
                    duration: autoDateDuration.metric,
                    offset:
                      autoDateOffset === 'after' ? autoDateDuration.value : -autoDateDuration.value,
                  })
                : task.startDate
            );
          }

          // we need to set the due date if those field are binding together
          if (selectedField === 'startDate') {
            if (task.dueDateBinding === START_DATE) {
              const { weeks, months, days } = task.dueDateInterval || {};
              setTaskValue(
                'dueDate',
                calculateDate({
                  date,
                  duration: findDuration({ weeks, months }),
                  offset: weeks || months || days,
                })
              );
            }
          }
        }
      }
    );

    return () => {
      emitter.removeAllListeners('FIND_SHIPMENT_VALUE');
    };
  });
  return null;
}
