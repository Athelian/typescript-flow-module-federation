// @flow
import * as React from 'react';
import type { Task } from 'generated/graphql';
import emitter from 'utils/emitter';
import { getByPath, setIn } from 'utils/fp';
import { START_DATE, DUE_DATE } from 'modules/task/form/components/TaskInfoSection/constants';
import { calculateDate, findDuration } from 'modules/task/form/components/TaskInfoSection/helpers';

type Props = {
  tasks: Array<Object>,
  setTaskValue: (Array<Task>) => void,
};

const updateDateInput = ({ field, value, task }: { field: string, value: mixed, task: Task }) => {
  const [milestoneId, fieldName] = field.split('.') || [];

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

          let newStartDate = startDate;
          let newDueDate = dueDate;

          if (startDateBinding === DUE_DATE) {
            // do the due date first
            if (dueDateBinding) {
              const { months, weeks, days } = dueDateInterval || {};
              const path = mappingFields[dueDateBinding];
              if (path) {
                newDueDate = calculateDate({
                  date: getByPath(path, latestValues),
                  duration: findDuration({ months, weeks }),
                  offset: months || weeks || days,
                });
              }
            }
            const { months, weeks, days } = startDateInterval || {};
            newStartDate = calculateDate({
              date: newDueDate,
              duration: findDuration({ months, weeks }),
              offset: months || weeks || days,
            });
          } else if (dueDateBinding === START_DATE) {
            // do the start date first
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
            const { months, weeks, days } = dueDateInterval || {};
            newDueDate = calculateDate({
              date: newStartDate,
              duration: findDuration({ months, weeks }),
              offset: months || weeks || days,
            });
          } else {
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
                  date: getByPath(path, latestValues),
                  duration: findDuration({ months, weeks }),
                  offset: months || weeks || days,
                });
              }
            }
          }

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
