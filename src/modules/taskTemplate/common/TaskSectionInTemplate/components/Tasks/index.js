// @flow
import React from 'react';
import { omit } from 'lodash';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import { parseGroupIds } from 'utils/task';
import SlideView from 'components/SlideView';
import TaskFormInSlide from 'modules/task/common/TaskFormInSlide';
import { TaskCard, CardAction } from 'components/Cards';
import { ItemStyle, EmptyMessageStyle } from './style';

type Props = {
  tasks: Array<Object>,
  onSwap: Function,
  onRemove: Function,
  onSave: Function,
  editable: Object,
  sortable: boolean,
  removable: boolean,
  viewForm: boolean,
  type: string,
};

const Tasks = ({
  tasks,
  onSwap,
  onRemove,
  onSave,
  editable,
  sortable,
  removable,
  viewForm,
  type,
}: Props) => {
  if (tasks.length === 0) {
    return (
      <div className={EmptyMessageStyle}>
        <FormattedMessage id="modules.Tasks.form.noTasks" defaultMessage="No tasks" />
      </div>
    );
  }

  return (tasks.map((task, index) => (
    <div id={`task_${task.id}`} className={ItemStyle} key={task.id}>
      <BooleanValue>
        {({ value: opened, set: selectTaskSlideToggle }) => (
          <>
            <TaskCard
              isInTemplate
              editable={editable}
              entity={{
                ...task.entity,
                __typename: type,
              }}
              task={task}
              hideParentInfo
              saveOnBlur={newValue => onSave(index, newValue)}
              onClick={viewForm ? () => selectTaskSlideToggle(true) : () => {}}
              actions={[
                sortable && index - 1 > -1 && (
                  <CardAction
                    icon="CHEVRON_DOUBLE_LEFT"
                    hoverColor="BLUE"
                    onClick={() => onSwap(index, 'left')}
                  />
                ),
                sortable && index + 1 < tasks.length && (
                  <CardAction
                    icon="CHEVRON_DOUBLE_RIGHT"
                    hoverColor="BLUE"
                    onClick={() => onSwap(index, 'right')}
                  />
                ),
                removable && (
                  <CardAction icon="REMOVE" hoverColor="RED" onClick={() => onRemove(task)} />
                ),
              ].filter(Boolean)}
            />
            <SlideView isOpen={opened} onRequestClose={() => selectTaskSlideToggle(false)}>
              {opened && (
                <TaskFormInSlide
                  groupIds={parseGroupIds(task)}
                  entity={{
                    ...task.entity,
                    __typename: type,
                  }}
                  inParentEntityForm
                  isInTemplate
                  parentEntity={type}
                  task={{ ...omit(task, ['entity']), sort: index }}
                  onSave={value => {
                    selectTaskSlideToggle(false);
                    onSave(index, value);
                  }}
                />
              )}
            </SlideView>
          </>
        )}
      </BooleanValue>
    </div>
  )): Array<any>);
};

export default Tasks;
