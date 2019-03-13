// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import TaskFormContainer from 'modules/task/form/container';
import validator from 'modules/task/form/validator';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import TaskForm from 'modules/task/form';
import { FormContainer } from 'modules/form';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';

type Props = {
  task: Object,
  isNew: boolean,
  initDetailValues: Object => void,
  onSave: Function,
  onCancel: Function,
};

const formContainer = new FormContainer();

class TaskFormWrapper extends React.Component<Props> {
  componentDidMount() {
    const { task, initDetailValues } = this.props;
    initDetailValues(task);
  }

  componentWillUnmount() {
    formContainer.onReset();
  }

  render() {
    const { isNew, onSave, onCancel } = this.props;
    return (
      <Provider inject={[formContainer]}>
        <Subscribe to={[TaskFormContainer]}>
          {({ originalValues, state, isDirty }) => {
            const values = { ...originalValues, ...state };
            return (
              <Layout
                navBar={
                  <SlideViewNavBar>
                    <EntityIcon icon="TASK" color="TASK" />
                    <JumpToSection>
                      <SectionTabs
                        link="task_taskSection"
                        label={<FormattedMessage id="modules.task.task" defaultMessage="TASK" />}
                        icon="TASK"
                      />
                    </JumpToSection>
                    <CancelButton onClick={onCancel} />
                    <SaveButton
                      disabled={!isDirty() || !formContainer.isReady(values, validator)}
                      onClick={() => onSave(values)}
                    />
                  </SlideViewNavBar>
                }
              >
                <TaskForm task={values} isNew={isNew} />
              </Layout>
            );
          }}
        </Subscribe>
      </Provider>
    );
  }
}

export default TaskFormWrapper;
