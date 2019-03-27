// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider } from 'unstated';
import { initValues } from 'modules/task/form/container';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { FormContainer } from 'modules/form';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import TaskInfoSection from 'modules/task/form/components/TaskInfoSection';

type Props = {
  task: Object,
  isNew: boolean,
  editable: boolean,
  initDetailValues: Object => void,
  onSave: Function,
  onCancel: Function,
  isReady: (formContainer: Object) => boolean,
};

const formContainer = new FormContainer();

class TaskFormInSlide extends React.Component<Props> {
  componentDidMount() {
    const { task, initDetailValues } = this.props;
    initDetailValues({ ...initValues, ...task });
  }

  componentWillUnmount() {
    const { initDetailValues } = this.props;
    formContainer.onReset();
    initDetailValues(initValues);
  }

  render() {
    const { isNew, editable, isReady, onSave, task, onCancel } = this.props;
    return (
      <Provider inject={[formContainer]}>
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
                  <SaveButton disabled={!isReady(formContainer)} onClick={onSave} />
                </>
              )}
            </SlideViewNavBar>
          }
        >
          <TaskInfoSection task={{ ...task, isNew }} hideParentInfo />
        </Layout>
      </Provider>
    );
  }
}

export default TaskFormInSlide;
