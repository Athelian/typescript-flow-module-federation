// @flow
import * as React from 'react';
import type { Order, OrderItem, Shipment, Batch, Task } from 'generated/graphql';
import emitter from 'utils/emitter';
import logger from 'utils/logger';
import { START_DATE } from 'modules/task/form/components/TaskInfoSection/constants';
import { calculateDate, findDuration } from 'modules/task/form/components/TaskInfoSection/helpers';
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

export default function AutoDateBinding({ tasks, type, values, setTaskValue }: Props) {
  React.useEffect(() => {
    const mappingFields = {
      Order: OrderMappingField,
      OrderItem: OrderItemMappingField,
      Batch: BatchMappingField,
      Shipment: findMappingFields(values.voyages || []),
      Product: {},
      ProductProvider: {},
      Project: {},
    };
    emitter.addListener('AUTO_DATE', (field: ?string, value: any) => {
      const latestValues = {
        ...values,
        ...(field ? { [field]: value } : {}),
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

          if (startDateBinding) {
            const { months, weeks, days } = startDateInterval || {};

            newStartDate = calculateDate({
              date: mappingDate({
                field: startDateBinding,
                mappingFields: mappingFields[type],
                values: latestValues,
                task,
              }),
              duration: findDuration({ months, weeks }),
              offset: months || weeks || days,
            });
          }

          if (dueDateBinding) {
            const { months, weeks, days } = dueDateInterval || {};

            newDueDate = calculateDate({
              date:
                dueDateBinding !== START_DATE
                  ? mappingDate({
                      field: dueDateBinding,
                      mappingFields: mappingFields[type],
                      values: latestValues,
                      task,
                    })
                  : newStartDate,
              duration: findDuration({ months, weeks }),
              offset: months || weeks || days,
            });
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
  }, [type, values, tasks, setTaskValue]);
  return null;
}
