// @flow
import * as React from 'react';
import type { Order, OrderItem, Shipment, Batch, Task } from 'generated/graphql';
import emitter from 'utils/emitter';
import logger from 'utils/logger';
import { START_DATE, DUE_DATE } from 'utils/task';
import { calculateBindingDate } from 'utils/date';
import useUser from 'hooks/useUser';
import { MappingFields as OrderMappingField } from 'modules/task/form/components/ParentEntity/components/OrderValueSpy';
import { MappingFields as OrderItemMappingField } from 'modules/task/form/components/ParentEntity/components/OrderItemValueSpy';
import { MappingFields as BatchMappingField } from 'modules/task/form/components/ParentEntity/components/BatchValueSpy';
import { getValueBy } from 'modules/task/form/components/ParentEntity/components/ShipmentValueSpy/helper';
import { findMappingFields } from 'modules/task/form/components/ParentEntity/components/ShipmentValueSpy';
import { type CompatibleEntityTypes } from 'modules/task/common/TaskSection';

type Props = {
  type: CompatibleEntityTypes,
  values: Object,
  tasks: Array<Object>,
  setTaskValue: Function,
};

// The binding date would come from 2 sources: parent entity or in task itself
// depend on the place, we will get data from *EntityContainer* or we need to query
const mappingDate = ({
  field,
  mappingFields,
  task,
  values,
}: {
  mappingFields: Object,
  field: string,
  task: Task,
  values: Order | Shipment | OrderItem | Batch,
}) => {
  const path = mappingFields[field] || 'N/A';
  if (path.includes('milestone')) {
    return getValueBy(path, task);
  }

  return getValueBy(path, values);
};

const defaultMappingFields = {
  ProjectDueDate: 'milestone.project.dueDate',
  MilestoneDueDate: 'milestone.dueDate',
};

export default function AutoDateBinding({ tasks, type, values, setTaskValue }: Props) {
  const { user } = useUser();
  React.useEffect(() => {
    const mappingFields = {
      Order: OrderMappingField,
      OrderItem: OrderItemMappingField,
      Batch: BatchMappingField,
      Shipment: findMappingFields(values.voyages || []),
      Product: defaultMappingFields,
      ProductProvider: defaultMappingFields,
    };
    emitter.addListener('AUTO_DATE', (field: mixed, value: mixed) => {
      const latestValues = {
        ...values,
        ...(field ? { [String(field)]: value } : {}),
      };
      logger.warn('auto calculate binding data', type, field, latestValues);
      setTaskValue(
        'todo.tasks',
        tasks.map(task => {
          const {
            startDate,
            startDateBinding,
            startDateInterval,
            dueDate,
            dueDateBinding,
            dueDateInterval,
          } = task;

          let newStartDate = startDate;
          let newDueDate = dueDate;

          if (startDateBinding === DUE_DATE) {
            // do the due date first
            if (dueDateBinding) {
              newDueDate = calculateBindingDate(
                mappingDate({
                  field: dueDateBinding,
                  mappingFields: mappingFields[type],
                  values: latestValues,
                  task,
                }),
                dueDateInterval,
                user.timezone
              );
            }
            newStartDate = calculateBindingDate(newDueDate, startDateInterval, user.timezone);
          } else if (dueDateBinding === START_DATE) {
            // do the start date first
            if (startDateBinding) {
              newStartDate = calculateBindingDate(
                mappingDate({
                  field: startDateBinding,
                  mappingFields: mappingFields[type],
                  values: latestValues,
                  task,
                }),
                startDateInterval,
                user.timezone
              );
            }
            newDueDate = calculateBindingDate(newStartDate, dueDateInterval, user.timezone);
          } else {
            if (startDateBinding) {
              newStartDate = calculateBindingDate(
                mappingDate({
                  field: startDateBinding,
                  mappingFields: mappingFields[type],
                  values: latestValues,
                  task,
                }),
                startDateInterval,
                user.timezone
              );
            }

            if (dueDateBinding) {
              newDueDate = calculateBindingDate(
                mappingDate({
                  field: dueDateBinding,
                  mappingFields: mappingFields[type],
                  values: latestValues,
                  task,
                }),
                dueDateInterval,
                user.timezone
              );
            }
          }

          logger.warn({
            newStartDate,
            newDueDate,
          });
          return {
            ...task,
            startDate: newStartDate,
            dueDate: newDueDate,
          };
        })
      );
    });

    return () => {
      emitter.removeAllListeners('AUTO_DATE');
    };
  }, [type, values, tasks, setTaskValue, user.timezone]);
  return null;
}
