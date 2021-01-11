// @flow
import React from 'react';
import type { DraggableProvided } from 'react-beautiful-dnd';
import type { Task } from 'generated/graphql';
import QueryFormPermissionContext from 'components/common/QueryForm/context';
import { intersection } from 'lodash';
import { BooleanValue } from 'react-values';
import { getByPath } from 'utils/fp';
import { TaskCard, CardAction } from 'components/Cards';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import SlideView from 'components/SlideView';
import { checkEditableFromEntity, parseGroupIds } from 'utils/task';
import TaskFormInSlide from 'modules/task/common/TaskFormInSlide';
import { TASK_SET_MILESTONE, TASK_DELETE } from 'modules/permission/constants/task';
import { MILESTONE_UPDATE } from 'modules/permission/constants/milestone';
import { PROJECT_UPDATE } from 'modules/permission/constants/project';
import { TaskItemWrapperStyle } from './style';

type Props = {|
  task: Task,
  isDragging: boolean,
  provided: DraggableProvided,
  isGroupedOver?: boolean,
  onChange: (taskId: string, task: Task) => void,
  onRemove: (taskId: string, isDelete: boolean) => void,
|};

function TaskItem({ task, isDragging, provided, onChange, onRemove }: Props) {
  // console.log('[debug] task owner is ', task?.ownedBy);
  return (
    <PartnerPermissionsWrapper data={task}>
      {(permissions, isOwner) => (
        <BooleanValue>
          {({ value: isOpen, set: toggleTaskForm }) => (
            <>
              <div
                className={TaskItemWrapperStyle(isDragging)}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <TaskCard
                  hideProjectInfo
                  entity={{
                    ...task.entity,
                    ...getByPath('order', task),
                    ...getByPath('orderItem', task),
                    ...getByPath('batch', task),
                    ...getByPath('product', task),
                    ...getByPath('productProvider', task),
                    ...getByPath('shipment', task),
                  }}
                  task={task}
                  actions={[
                    (permissions.includes(TASK_SET_MILESTONE) ||
                      permissions.includes(PROJECT_UPDATE) ||
                      permissions.includes(MILESTONE_UPDATE)) && (
                      <CardAction
                        icon="CLEAR"
                        hoverColor="RED"
                        onClick={() => onRemove(task.id, false)}
                      />
                    ),
                    // Hidden on UI until we have create new task for project form
                    permissions.includes(TASK_DELETE) && false && (
                      <CardAction
                        icon="REMOVE"
                        hoverColor="RED"
                        onClick={() => onRemove(task.id, true)}
                      />
                    ),
                  ].filter(Boolean)}
                  position={task.milestoneSort + 1}
                  editable={checkEditableFromEntity(
                    getByPath('entity.__typename', task),
                    (checkPermission: string | Array<string>) => {
                      if (Array.isArray(checkPermission)) {
                        return intersection(permissions, checkPermission).length > 0;
                      }
                      return permissions.includes(checkPermission);
                    }
                  )}
                  navigable={{ project: false }}
                  saveOnBlur={value => onChange(task.id, value)}
                  onClick={() => {
                    // This is using for fixing a edge case when on blur doesn't fire on inline edit for task card
                    if (document.activeElement) document.activeElement.blur();
                    setTimeout(() => toggleTaskForm(true), 200);
                  }}
                />
              </div>

              <SlideView
                isOpen={isOpen}
                onRequestClose={() => toggleTaskForm(false)}
                shouldConfirm={() => document.getElementById('task_form_save_button')}
              >
                {isOpen && (
                  <QueryFormPermissionContext.Provider
                    value={{
                      isOwner,
                      permissions,
                    }}
                  >
                    <TaskFormInSlide
                      inParentEntityForm={false}
                      isInProject
                      groupIds={parseGroupIds(task)}
                      entity={task.entity}
                      task={{ ...task, sort: task.milestoneSort + 1 }}
                      onSave={value => {
                        onChange(task.id, value);
                        toggleTaskForm(false);
                      }}
                    />
                  </QueryFormPermissionContext.Provider>
                )}
              </SlideView>
            </>
          )}
        </BooleanValue>
      )}
    </PartnerPermissionsWrapper>
  );
}

export default React.memo<Props>(TaskItem);
