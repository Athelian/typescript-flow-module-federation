// @flow
import * as React from 'react';
import { omit } from 'lodash';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import SlideView from 'components/SlideView';
import type { TaskCardEditableProps } from 'components/Cards/TaskCard/type.js.flow';
import TaskFormInSlide from 'modules/task/common/TaskFormInSlide';
import { TaskCard, CardAction } from 'components/Cards';
import { ItemStyle, EmptyMessageStyle } from './style';

type OptionalProps = {
  isInTemplate: boolean,
};

type Props = OptionalProps & {
  tasks: Array<Object>,
  groupIds: Array<string>,
  onSwap: Function,
  onRemove: Function,
  onSave: Function,
  editable: TaskCardEditableProps,
  navigable: {
    project: boolean,
  },
  removable: boolean,
  sortable: boolean,
  viewForm: boolean,
  type: string,
  entityId: string,
};

const defaultProps = {
  isInTemplate: false,
};

const Tasks = ({
  tasks,
  groupIds,
  onSwap,
  onRemove,
  onSave,
  editable,
  navigable,
  viewForm,
  removable,
  sortable,
  type,
  entityId,
  isInTemplate,
}: Props) => {
  if (tasks.length === 0 && isInTemplate)
    return (
      <div className={EmptyMessageStyle}>
        <FormattedMessage id="modules.Tasks.form.noTasks" defaultMessage="No tasks" />
      </div>
    );

  return (tasks.map((task, index) => (
    <div id={`task_${task.id}`} className={ItemStyle} key={task.id}>
      <BooleanValue>
        {({ value: opened, set: selectTaskSlideToggle }) => (
          <>
            <TaskCard
              groupIds={groupIds}
              isInTemplate={isInTemplate}
              editable={editable}
              navigable={navigable}
              entity={{
                ...task.entity,
                __typename: type,
              }}
              task={task}
              position={index + 1}
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
                  entity={{
                    ...task.entity,
                    __typename: type,
                    id: entityId,
                  }}
                  parentEntity={type}
                  inParentEntityForm
                  task={{ ...omit(task, ['entity']), sort: index }}
                  onSave={value => {
                    selectTaskSlideToggle(false);
                    onSave(index, value);
                  }}
                  groupIds={groupIds}
                />
              )}
            </SlideView>
          </>
        )}
      </BooleanValue>
    </div>
  )): Array<any>);
};

Tasks.defaultProps = defaultProps;
export default Tasks;
