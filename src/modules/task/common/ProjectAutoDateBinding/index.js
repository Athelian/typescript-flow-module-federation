// @flow
import * as React from 'react';
import type { Task } from 'generated/graphql';
import emitter from 'utils/emitter';
import { getByPath, setIn } from 'utils/fp';
import { recalculateTaskBindingDate } from 'utils/task';

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
    emitter.addListener('AUTO_DATE', (field: mixed, value: mixed) => {
      setTaskValue(
        tasks.map(task => {
          const latestTask = field
            ? updateDateInput({
                field: String(field),
                value,
                task,
              })
            : task;

          return recalculateTaskBindingDate(latestTask);
        })
      );
    });

    return () => {
      emitter.removeAllListeners('AUTO_DATE');
    };
  }, [tasks, setTaskValue]);
  return null;
}
