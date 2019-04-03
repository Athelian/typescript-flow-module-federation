// @flow
import React, { useEffect } from 'react';
import { Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { BooleanValue } from 'react-values';
import { TaskCard } from 'components/Cards';
import TaskFormInSlide from 'modules/task/common/TaskFormInSlide';
import RMTaskListContainer from '../../container';

type Props = {
  tasks: Array<Object>,
  initDetailValues: Function,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const TaskListInSlide = ({ tasks, initDetailValues, onLoadMore, hasMore, isLoading }: Props) => {
  useEffect(() => {
    initDetailValues(tasks);
  }, [initDetailValues, tasks]);

  return (
    <Subscribe to={[RMTaskListContainer]}>
      {taskListContainer => {
        const {
          state: { tasks: values = [] },
        } = taskListContainer;
        return (
          <GridView
            onLoadMore={onLoadMore}
            hasMore={hasMore}
            isLoading={isLoading}
            isEmpty={values.length === 0}
            itemWidth="200px"
            emptyMessage={
              <FormattedMessage
                id="modules.RelationalMaps.noTasksFound"
                defaultMessage="No tasks found"
              />
            }
          >
            {values.map((task, index) => (
              <BooleanValue key={task.id}>
                {({ value: isOpen, set: toggleTaskForm }) => (
                  <>
                    <TaskCard
                      task={task}
                      position={index + 1}
                      editable
                      saveOnBlur={value =>
                        taskListContainer.setDeepFieldValue(`tasks.${index}`, value)
                      }
                      onClick={() => toggleTaskForm(true)}
                    />
                    <SlideView isOpen={isOpen} onRequestClose={() => toggleTaskForm(false)}>
                      {isOpen && (
                        <TaskFormInSlide
                          editable
                          task={{ ...task, sort: index }}
                          onSave={value => {
                            taskListContainer.setDeepFieldValue(`tasks.${index}`, value);
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
      }}
    </Subscribe>
  );
};

export default TaskListInSlide;
