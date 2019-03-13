// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import scrollIntoView from 'utils/scrollIntoView';
import { TaskCard, CardAction } from 'components/Cards';
import { ItemGridStyle, ItemStyle, EmptyMessageStyle } from './style';

type Props = {
  tasks: Array<Object>,
  onRemove: Function,
  onSave: Function,
  checkPermission: string,
};

const Tasks = ({ tasks, onRemove, onSave, checkPermission }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const allowUpdate = hasPermission(checkPermission);
  return tasks.length > 0 ? (
    <div className={ItemGridStyle}>
      {tasks.map((task, index) => (
        <div id={`task_${task.id}`} className={ItemStyle} key={task.id}>
          <TaskCard
            editable={allowUpdate}
            task={task}
            saveOnBlur={newValue => onSave(index, newValue)}
            onClick={() => {
              // TODO: migrate to task form later
              scrollIntoView({
                targetId: `shipmentTask_${task.id}`,
                boundaryId: 'tasksSection',
              });
            }}
            actions={[<CardAction icon="REMOVE" hoverColor="RED" onClick={() => onRemove(task)} />]}
          />
        </div>
      ))}
    </div>
  ) : (
    <div className={EmptyMessageStyle}>
      <FormattedMessage id="modules.Tasks.form.noTasks" defaultMessage="No tasks" />
    </div>
  );
};

export default Tasks;
