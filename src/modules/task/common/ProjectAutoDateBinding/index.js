// @flow
import * as React from 'react';
import type { Task } from 'generated/graphql';
import emitter from 'utils/emitter';
import logger from 'utils/logger';
import { getByPath, setIn } from 'utils/fp';
import { START_DATE } from 'modules/task/form/components/TaskInfoSection/constants';
import { calculateDate, findDuration } from 'modules/task/form/components/TaskInfoSection/helpers';

type Props = {
  tasks: Array<Object>,
  setTaskValue: (Array<Task>) => void,
};

const updateDateInput = ({ field, value, task }: { field: string, value: mixed, task: Task }) => {
  const [milestoneId, fieldName] = field.split('.') || [];
  logger.warn({
    milestoneId,
    fieldName,
    field,
    value,
    task,
  });

  // if file name exist which means that is come from milestone due date
  if (fieldName) {
    if (getByPath('milestone.id', task) === milestoneId) {
      return setIn(`milestone.${fieldName}`, value, task);
    }
    return task;
  }

  if (['dueDate'].includes(field)) return setIn(`milestone.project.${field}`, value, task);

  return task;
};

// Project is the special case which is use only for project form
export default function ProjectAutoDateBinding({ tasks, setTaskValue }: Props) {
  React.useEffect(() => {
    const mappingFields = {
      ProjectDueDate: 'milestone.project.dueDate',
      MilestoneDueDate: 'milestone.dueDate',
    };
    emitter.addListener('AUTO_DATE', (field: mixed, value: mixed) => {
      logger.warn('auto calculate binding data for project', field, value, tasks);
      setTaskValue(
        tasks.map(task => {
          const {
            startDate,
            startDateBinding,
            startDateInterval,
            dueDate,
            dueDateBinding,
            dueDateInterval,
          } = task;

          const latestValues = field
            ? updateDateInput({
                field: String(field),
                value,
                task,
              })
            : task;

          logger.warn('project', {
            latestValues,
            startDate,
            startDateBinding,
            startDateInterval,
            dueDate,
            dueDateBinding,
            dueDateInterval,
          });

          let newStartDate = startDate;
          let newDueDate = dueDate;

          if (startDateBinding) {
            const { months, weeks, days } = startDateInterval || {};
            const path = mappingFields[startDateBinding];
            if (path) {
              newStartDate = calculateDate({
                date: getByPath(path, latestValues),
                duration: findDuration({ months, weeks }),
                offset: months || weeks || days,
              });
            }
          }

          if (dueDateBinding) {
            const { months, weeks, days } = dueDateInterval || {};
            const path = mappingFields[dueDateBinding];
            if (path) {
              newDueDate = calculateDate({
                date: dueDateBinding !== START_DATE ? getByPath(path, latestValues) : newStartDate,
                duration: findDuration({ months, weeks }),
                offset: months || weeks || days,
              });
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
  }, [tasks, setTaskValue]);
  return null;
}
