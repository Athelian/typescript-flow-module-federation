// @flow
import * as React from 'react';
import emitter from 'utils/emitter';
import logger from 'utils/logger';
import { START_DATE } from 'modules/task/form/components/TaskInfoSection/constants';
import { calculateDate, findDuration } from 'modules/task/form/components/TaskInfoSection/helpers';
import { MappingFields as OrderMappingField } from 'modules/task/form/components/ParentEntity/components/OrderValueSpy';
import { MappingFields as BatchMappingField } from 'modules/task/form/components/ParentEntity/components/BatchValueSpy';
import { getValueBy } from 'modules/task/form/components/ParentEntity/components/ShipmentValueSpy/helper';
import { findMappingFields } from 'modules/task/form/components/ParentEntity/components/ShipmentValueSpy';

type Props = {
  type: 'order' | 'orderItem' | 'batch' | 'shipment' | 'product',
  values: Object,
  tasks: Array<Object>,
  setTaskValue: Function,
};

export default function AutoDateBinding({ tasks, type, values, setTaskValue }: Props) {
  React.useEffect(() => {
    const mappingFields = {
      order: OrderMappingField,
      orderItem: OrderMappingField,
      batch: BatchMappingField,
      shipment: findMappingFields(values.voyages || []),
      product: {},
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
              date: getValueBy(mappingFields[type][startDateBinding], latestValues),
              duration: findDuration({ months, weeks }),
              offset: months || weeks || days,
            });
          }

          if (dueDateBinding) {
            const { months, weeks, days } = dueDateInterval || {};
            newDueDate = calculateDate({
              date:
                dueDateBinding !== START_DATE
                  ? getValueBy(mappingFields[type][dueDateBinding], latestValues)
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
