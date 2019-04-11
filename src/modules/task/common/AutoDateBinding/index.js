// @flow
import * as React from 'react';
import emitter from 'utils/emitter';
import logger from 'utils/logger';
import { getByPath } from 'utils/fp';
import { START_DATE } from 'modules/task/form/components/TaskInfoSection/constants';
import { calculateDate, findDuration } from 'modules/task/form/components/TaskInfoSection/helpers';

type Props = {
  type: 'order' | 'batch' | 'shipment',
  values: Object,
  tasks: Array<Object>,
  setTaskValue: Function,
};

const MappingFields = {
  order: {
    OrderIssuedAt: 'issuedAt',
  },
  shipment: {},
  batch: {},
};

export default function AutoDateBinding({ tasks, type, values, setTaskValue }: Props) {
  React.useEffect(() => {
    emitter.addListener('AUTO_DATE', (field, value) => {
      const latestValues = {
        ...values,
        [field]: value,
      };
      logger.warn({
        tasks,
        values,
        latestValues,
        setTaskValue,
      });
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
              date: getByPath(MappingFields[type][startDateBinding], latestValues),
              duration: findDuration({ months, weeks }),
              offset: months || weeks || days,
            });
          }

          if (dueDateBinding) {
            const { months, weeks, days } = dueDateInterval || {};
            newDueDate = calculateDate({
              date:
                dueDateBinding !== START_DATE
                  ? getByPath(MappingFields[type][dueDateBinding], latestValues)
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
