// @flow
import React, { memo, useEffect } from 'react';
import { Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import Layout from 'components/Layout';
import SlideView from 'components/SlideView';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { FormContainer, resetFormState } from 'modules/form';
import { ResetButton, SaveButton } from 'components/Buttons';
import { BooleanValue } from 'react-values';
import { TaskCard } from 'components/Cards';
import TaskFormInSlide from 'modules/task/common/TaskFormInSlide';
import { GridViewWrapperStyle } from './style';
import RMTaskListContainer from '../../container';

type Props = {
  tasks: Array<Object>,
  initDetailValues: Function,
};

const TaskListInSlide = ({ tasks, initDetailValues }: Props) => {
  useEffect(() => {
    initDetailValues(tasks);
  });

  return (
    <Subscribe to={[RMTaskListContainer, FormContainer]}>
      {(taskListContainer, formContainer) => {
        const {
          state: { tasks: values = [] },
        } = taskListContainer;
        return (
          <Layout
            navBar={
              <SlideViewNavBar>
                <EntityIcon icon="TASK" color="TASK" />
                {taskListContainer.isDirty() && (
                  <>
                    <ResetButton
                      onClick={() => {
                        resetFormState(taskListContainer, 'tasks');
                        formContainer.onReset();
                      }}
                    />
                    <SaveButton onClick={() => console.log('save')} />
                  </>
                )}
              </SlideViewNavBar>
            }
          >
            <div className={GridViewWrapperStyle}>
              {values.length === 0 ? (
                <FormattedMessage
                  id="modules.RelationalMaps.noTasksFound"
                  defaultMessage="No tasks found"
                />
              ) : (
                values.map((task, index) => (
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
                ))
              )}
            </div>
          </Layout>
        );
      }}
    </Subscribe>
  );
};

export default memo<Props>(TaskListInSlide);
