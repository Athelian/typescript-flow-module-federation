// @flow
import * as React from 'react';
import { omit } from 'lodash';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import SlideView from 'components/SlideView';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import TaskFormInSlide from 'modules/task/common/TaskFormInSlide';
import { TaskCard, CardAction } from 'components/Cards';
import { TASK_UPDATE } from 'modules/permission/constants/task';
import { ItemStyle, EmptyMessageStyle } from './style';

type OptionalProps = {
  isInTemplate: boolean,
};
type Props = OptionalProps & {
  tasks: Array<Object>,
  onSwap: Function,
  onRemove: Function,
  onSave: Function,
  editable: boolean,
  removable: boolean,
  viewForm: boolean,
  type: string,
};

const defaultProps = {
  isInTemplate: false,
};

const Tasks = ({
  tasks,
  onSwap,
  onRemove,
  onSave,
  editable,
  viewForm,
  removable,
  type,
  isInTemplate,
}: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
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
              isInTemplate={isInTemplate}
              editable={editable}
              task={{
                ...task,
                entity: {
                  ...task.entity,
                  __typename: type,
                },
              }}
              position={index + 1}
              hideParentInfo
              saveOnBlur={newValue => onSave(index, newValue)}
              onClick={viewForm ? () => selectTaskSlideToggle(true) : () => {}}
              actions={[
                editable && index - 1 > -1 && (
                  <CardAction
                    icon="CHEVRON_DOUBLE_LEFT"
                    hoverColor="BLUE"
                    onClick={() => onSwap(index, 'left')}
                  />
                ),
                editable && index + 1 < tasks.length && (
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
                  // TODO: fix partner id for staff query
                  groupIds={[]}
                  entity={{
                    ...task.entity,
                    __typename: type,
                  }}
                  isInTemplate={isInTemplate}
                  parentEntity={type}
                  editable={hasPermission(TASK_UPDATE)}
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

Tasks.defaultProps = defaultProps;
export default Tasks;
