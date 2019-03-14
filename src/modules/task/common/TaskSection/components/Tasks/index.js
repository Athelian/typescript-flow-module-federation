// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import SlideView from 'components/SlideView';
import TaskFormWrapper from 'modules/task/common/TaskFormWrapper';
import TaskContainer from 'modules/task/form/container';
import { TaskCard, CardAction } from 'components/Cards';
import { ItemGridStyle, ItemStyle, EmptyMessageStyle } from './style';

type Props = {
  tasks: Array<Object>,
  onRemove: Function,
  onSave: Function,
  editable: boolean,
  removable: boolean,
  viewForm: boolean,
  type: string,
};

const Tasks = ({ tasks, onRemove, onSave, editable, viewForm, removable, type }: Props) => {
  return tasks.length > 0 ? (
    <div className={ItemGridStyle}>
      {tasks.map((task, index) => (
        <div id={`task_${task.id}`} className={ItemStyle} key={task.id}>
          <BooleanValue>
            {({ value: opened, set: selectTaskSlideToggle }) => (
              <>
                <TaskCard
                  editable={editable}
                  task={{
                    ...task,
                    entity: {
                      ...task.entity,
                      __typename: type,
                    },
                  }}
                  position={index + 1}
                  saveOnBlur={newValue => onSave(index, newValue)}
                  onClick={viewForm ? () => selectTaskSlideToggle(true) : () => {}}
                  actions={[
                    removable && (
                      <CardAction icon="REMOVE" hoverColor="RED" onClick={() => onRemove(task)} />
                    ),
                  ].filter(Boolean)}
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
