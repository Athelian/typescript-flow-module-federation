// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { FormContainer } from 'modules/form';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import validator from 'modules/task/form/validator';
import TaskContainer from 'modules/task/form/container';
import TaskForm from 'modules/task/form';

type OptionalProps = {
  isInTemplate: boolean,
};

type Props = OptionalProps & {
  task: Object,
  editable: boolean,
  onSave: Function,
  onCancel: Function,
};

const defaultProps = {
  isInTemplate: false,
};

const formContainer = new FormContainer();

const TaskFormInSlide = ({ editable, onSave, task, onCancel, isInTemplate }: Props) => {
  return (
    <Provider inject={[formContainer]}>
      <Subscribe to={[TaskContainer]}>
        {({ state, isDirty, initDetailValues }) => (
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
                {editable && (
                  <>
                    <CancelButton onClick={onCancel} />
                    <SaveButton
                      disabled={!formContainer.isReady(state, validator) || !isDirty()}
                      onClick={() => onSave(state)}
                    />
                  </>
                )}
              </SlideViewNavBar>
            }
          >
            <TaskForm
              task={task}
              hideParentInfo
              isInTemplate={isInTemplate}
              onFormReady={() => initDetailValues(task)}
            />
          </Layout>
        )}
      </Subscribe>
    </Provider>
  );
};

TaskFormInSlide.defaultProps = defaultProps;

export default TaskFormInSlide;
