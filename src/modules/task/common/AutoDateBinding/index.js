// @flow
import * as React from 'react';
import emitter from 'utils/emitter';
import logger from 'utils/logger';
import { getByPath } from 'utils/fp';
import { START_DATE } from 'modules/task/form/components/TaskInfoSection/constants';
import { calculateDate, findDuration } from 'modules/task/form/components/TaskInfoSection/helpers';
import { MappingFields as OrderMappingField } from 'modules/task/form/components/ParentEntity/components/OrderValueSpy';
import { MappingFields as BatchMappingField } from 'modules/task/form/components/ParentEntity/components/BatchValueSpy';
import { findMappingFields } from 'modules/task/form/components/ParentEntity/components/ShipmentValueSpy';

type Props = {
  type: 'order' | 'batch' | 'shipment',
  values: Object,
  tasks: Array<Object>,
  setTaskValue: Function,
};

export default function AutoDateBinding({ tasks, type, values, setTaskValue }: Props) {
  React.useEffect(() => {
    const mappingFields = {
      order: OrderMappingField,
      batch: BatchMappingField,
      shipment: findMappingFields(values.voyages || []),
    };
    emitter.addListener('AUTO_DATE', (field: ?string, value: any) => {
      const latestValues = {
        ...values,
        ...(field ? { [field]: value } : {}),
      };
      logger.warn('auto calculate binding data');
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
              date: getByPath(mappingFields[type][startDateBinding], latestValues),
              duration: findDuration({ months, weeks }),
              offset: months || weeks || days,
            });
          }

          if (dueDateBinding) {
            const { months, weeks, days } = dueDateInterval || {};
            newDueDate = calculateDate({
              date:
                dueDateBinding !== START_DATE
                  ? getByPath(mappingFields[type][dueDateBinding], latestValues)
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
