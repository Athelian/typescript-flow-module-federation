// @flow
import * as React from 'react';
import type { Task } from 'generated/graphql';
import emitter from 'utils/emitter';
import { getByPath, setIn } from 'utils/fp';
import useUser from 'hooks/useUser';
import { recalculateTaskBindingDate } from 'utils/task';
import { calculateBindingDate } from 'utils/date';

type Props = {
  tasks: Array<Object>,
  setTaskValue: (Array<Task>) => void,
  project: Object,
  milestones: Array<Object>,
  updateMilestones: Function,
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

  if (['dueDate'].includes(field)) {
    return setIn(`milestone.project.${field}`, value, task);
  }

  return task;
};

// Project is the special case which is use only for project form
export default function ProjectAutoDateBinding({
  project,
  milestones,
  updateMilestones,
  tasks,
  setTaskValue,
}: Props) {
  const { user } = useUser();
  React.useEffect(() => {
    emitter.addListener('AUTO_DATE', (field: mixed, value: mixed) => {
      updateMilestones(
        'milestones',
        milestones.map(item => {
          const { dueDateBinding, dueDateInterval } = item;
          if (dueDateBinding) {
            return {
              ...item,
              dueDate: calculateBindingDate(project.dueDate, dueDateInterval, user.timezone),
            };
          }
          return item;
        })
      );
      setTaskValue(
        tasks.map(task => {
          const latestTask = field
            ? updateDateInput({
                field: String(field),
                value,
                task,
              })
            : task;

          return recalculateTaskBindingDate(latestTask, user.timezone);
        })
      );
    });

    return () => {
      emitter.removeAllListeners('AUTO_DATE');
    };
  }, [project, milestones, updateMilestones, tasks, setTaskValue, user.timezone]);
  return null;
}
