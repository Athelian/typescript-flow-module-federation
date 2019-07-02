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
  return (
    <div
      className={TaskItemWrapperStyle(isDragging)}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <PartnerPermissionsWrapper data={task} key={task.id}>
        {(permissions, isOwner) => (
          <BooleanValue>
            {({ value: isOpen, set: toggleTaskForm }) => (
              <>
                <TaskCard
                  hideProjectInfo
                  groupIds={parseGroupIds(task)}
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
                    permissions.includes(TASK_DELETE) && (
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
                  onClick={() => toggleTaskForm(true)}
                />
                <SlideView isOpen={isOpen} onRequestClose={() => toggleTaskForm(false)}>
                  {isOpen && (
                    <QueryFormPermissionContext.Provider
                      value={{
                        isOwner,
                        permissions,
                      }}
                    >
                      <TaskFormInSlide
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
    </div>
  );
}

export default React.memo<Props>(TaskItem);
