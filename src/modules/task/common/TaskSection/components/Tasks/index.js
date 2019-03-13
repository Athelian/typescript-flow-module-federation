// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import SlideView from 'components/SlideView';
import TaskFormWrapper from 'modules/task/common/TaskFormWrapper';
import TaskContainer from 'modules/task/form/container';
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
          <BooleanValue>
            {({ value: opened, set: selectTaskSlideToggle }) => (
              <>
                <TaskCard
                  editable={allowUpdate}
                  task={task}
                  position={index + 1}
                  saveOnBlur={newValue => onSave(index, newValue)}
                  onClick={() => selectTaskSlideToggle(true)}
                  actions={[
                    <CardAction icon="REMOVE" hoverColor="RED" onClick={() => onRemove(task)} />,
                  ]}
                />
                <SlideView
                  isOpen={opened}
                  onRequestClose={() => selectTaskSlideToggle(false)}
                  options={{ width: '1030px' }}
                >
                  {opened && (
                    <Subscribe to={[TaskContainer]}>
                      {({ initDetailValues }) => (
                        <TaskFormWrapper
                          initDetailValues={initDetailValues}
                          task={task}
                          isNew={!!task.isNew}
                          onCancel={() => selectTaskSlideToggle(false)}
                          onSave={newValue => {
                            selectTaskSlideToggle(false);
                            onSave(index, newValue);
                          }}
                        />
                      )}
                    </Subscribe>
                  )}
                </SlideView>
              </>
            )}
          </BooleanValue>
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
