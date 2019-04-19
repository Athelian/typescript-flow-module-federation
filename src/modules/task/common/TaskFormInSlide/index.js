// @flow
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { FormContainer, resetFormState } from 'modules/form';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, ResetButton } from 'components/Buttons';
import validator from 'modules/task/form/validator';
import TaskContainer from 'modules/task/form/container';
import TaskForm from 'modules/task/form';

type OptionalProps = {
  isInTemplate: boolean,
  parentEntity?: string,
};

type Props = OptionalProps & {
  task: Object,
  editable: boolean,
  onSave: Function,
};

const defaultProps = {
  isInTemplate: false,
};

const formContainer = new FormContainer();

const TaskFormInSlide = ({ editable, onSave, task, parentEntity, isInTemplate }: Props) => {
  useEffect(() => {
    return () => formContainer.onReset();
  });

  return (
    <Provider inject={[formContainer]}>
      <Subscribe to={[TaskContainer]}>
        {taskContainer => (
          <Layout
            navBar={
              <SlideViewNavBar>
                <EntityIcon icon="TASK" color="TASK" />
                <JumpToSection>
                  <SectionTabs
                    link="task_taskSection"
                    label={<FormattedMessage id="modules.Tasks.task" defaultMessage="TASK" />}
                    icon="TASK"
                  />
                </JumpToSection>
                {editable && taskContainer.isDirty() && (
                  <>
                    <ResetButton
                      onClick={() => {
                        resetFormState(taskContainer);
                        formContainer.onReset();
                      }}
                    />
                    <SaveButton
                      disabled={!formContainer.isReady(taskContainer.state, validator)}
                      onClick={() => onSave(taskContainer.state)}
                    />
                  </>
                )}
              </SlideViewNavBar>
            }
          >
            <TaskForm
              task={task}
              hideParentInfo
              parentEntity={parentEntity}
              isInTemplate={isInTemplate}
              onFormReady={() => taskContainer.initDetailValues(task)}
            />
          </Layout>
        )}
      </Subscribe>
    </Provider>
  );
};

TaskFormInSlide.defaultProps = defaultProps;

export default TaskFormInSlide;
