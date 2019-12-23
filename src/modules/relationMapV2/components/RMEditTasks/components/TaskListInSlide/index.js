// @flow
import * as React from 'react';
import { intersection, lowerFirst } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { getByPath } from 'utils/fp';
import { checkEditableFromEntity, parseGroupIds } from 'utils/task';
import QueryFormPermissionContext from 'components/common/QueryForm/context';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import { PROJECT_FORM } from 'modules/permission/constants/project';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { TaskCard } from 'components/Cards';
import TaskFormInSlide from 'modules/task/common/TaskFormInSlide';

type Props = {
  tasks: Array<Object>,
  onChange: (taskId: string, value: Object) => void,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const TaskListInSlide = ({ tasks, onChange, onLoadMore, hasMore, isLoading }: Props) => {
  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      isEmpty={tasks.length === 0}
      itemWidth="195px"
      emptyMessage={
        <FormattedMessage
          id="modules.RelationalMaps.noTasksFound"
          defaultMessage="No tasks found"
        />
      }
    >
      {tasks.map((task, index) => (
        <PartnerPermissionsWrapper data={task} key={task.id}>
          {(permissions, isOwner) => (
            <BooleanValue>
              {({ value: isOpen, set: toggleTaskForm }) => (
                <>
                  <TaskCard
                    groupIds={parseGroupIds(task)}
                    entity={task[lowerFirst(getByPath('entity.__typename', task))]}
                    task={task}
                    editable={checkEditableFromEntity(
                      getByPath('entity.__typename', task),
                      (checkPermission: string | Array<string>) => {
                        if (Array.isArray(checkPermission)) {
                          return intersection(permissions, checkPermission).length > 0;
                        }
                        return permissions.includes(checkPermission);
                      }
                    )}
                    navigable={{ project: permissions.includes(PROJECT_FORM) }}
                    saveOnBlur={value => onChange(task.id, value)}
                    onClick={() => toggleTaskForm(true)}
                  />
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
                          groupIds={parseGroupIds(task)}
                          entity={task.entity}
                          task={{ ...task, sort: index }}
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
      ))}
    </GridView>
  );
};

export default React.memo<Props>(TaskListInSlide);
