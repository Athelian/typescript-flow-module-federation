// @flow
import * as React from 'react';
import { intersection } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { getByPath } from 'utils/fp';
import { checkEditableFromEntity, parseGroupIds } from 'utils/task';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { TaskCard } from 'components/Cards';
import TaskFormInSlide from 'modules/task/common/TaskFormInSlide';

type Props = {
  tasks: Array<Object>,
  onChange: Function,
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
      itemWidth="200px"
      emptyMessage={
        <FormattedMessage
          id="modules.RelationalMaps.noTasksFound"
          defaultMessage="No tasks found"
        />
      }
    >
      {tasks.map((task, index) => (
        <BooleanValue key={task.id}>
          {({ value: isOpen, set: toggleTaskForm }) => (
            <>
              <PartnerPermissionsWrapper data={task}>
                {permissions => (
                  <TaskCard
                    task={task}
                    position={index + 1}
                    editable={checkEditableFromEntity(
                      getByPath('entity.__typename', task),
                      (checkPermission: string | Array<string>) => {
                        if (Array.isArray(checkPermission)) {
                          return intersection(permissions, checkPermission).length > 0;
                        }
                        return permissions.includes(checkPermission);
                      }
                    )}
                    saveOnBlur={value => onChange(`tasks.${index}`, value)}
                    onClick={() => toggleTaskForm(true)}
                  />
                )}
              </PartnerPermissionsWrapper>
              <SlideView isOpen={isOpen} onRequestClose={() => toggleTaskForm(false)}>
                {isOpen && (
                  <TaskFormInSlide
                    groupIds={parseGroupIds(task)}
                    editable
                    entity={task.entity}
                    task={{ ...task, sort: index }}
                    onSave={value => {
                      onChange(`tasks.${index}`, value);
                      toggleTaskForm(false);
                    }}
                  />
                )}
              </SlideView>
            </>
          )}
        </BooleanValue>
      ))}
    </GridView>
  );
};

export default TaskListInSlide;
