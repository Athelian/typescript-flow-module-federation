// @flow
import React, { useEffect } from 'react';
import { Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { BooleanValue } from 'react-values';
import { TaskCard } from 'components/Cards';
import TaskFormInSlide from 'modules/task/common/TaskFormInSlide';
import RMrmEditTasksContainer from '../../container';

type Props = {
  tasks: Array<Object>,
  initDetailValues: Function,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const TaskListInSlide = ({ tasks, initDetailValues, onLoadMore, hasMore, isLoading }: Props) => {
  useEffect(() => {
    if (tasks.length > 0) {
      initDetailValues(tasks);
    }
  }, [initDetailValues, tasks]);

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
      <Subscribe to={[RMrmEditTasksContainer]}>
        {rmEditTasksContainer => {
          const {
            state: { tasks: values = [] },
          } = rmEditTasksContainer;
          return values.map((task, index) => (
            <BooleanValue key={task.id}>
              {({ value: isOpen, set: toggleTaskForm }) => (
                <>
                  <TaskCard
                    task={task}
                    position={task.sort + 1}
                    editable
                    saveOnBlur={value =>
                      rmEditTasksContainer.setDeepFieldValue(`tasks.${index}`, value)
                    }
                    onClick={() => toggleTaskForm(true)}
                  />
                  <SlideView isOpen={isOpen} onRequestClose={() => toggleTaskForm(false)}>
                    {isOpen && (
                      <TaskFormInSlide
                        editable
                        task={{ ...task, sort: index }}
                        onSave={value => {
                          rmEditTasksContainer.setDeepFieldValue(`tasks.${index}`, value);
                          toggleTaskForm(false);
                        }}
                      />
                    )}
                  </SlideView>
                </>
              )}
            </BooleanValue>
          ));
        }}
      </Subscribe>
    </GridView>
  );
};

export default TaskListInSlide;
