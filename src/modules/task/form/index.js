// @flow
import React from 'react';
import { isEquals } from 'utils/fp';
import TaskInfoSection from './components/TaskInfoSection';
import ProjectSection from './components/ProjectSection';
import ParentEntity from './components/ParentEntity';
import { TaskFormWrapperStyle } from './style';

type Props = {|
  groupIds: Array<string>,
  task?: Object,
  entity?: Object,
  onFormReady?: () => void,
  parentEntity?: string,
  inParentEntityForm: boolean,
  isInTemplate?: boolean,
  isInProject?: boolean,
|};

export default class TaskForm extends React.Component<Props> {
  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  shouldComponentUpdate(nextProp: Props) {
    const { task } = this.props;

    return !isEquals(task, nextProp.task);
  }

  render() {
    const {
      task,
      groupIds,
      entity,
      parentEntity,
      isInTemplate,
      isInProject,
      inParentEntityForm,
    } = this.props;
    return (
      <div className={TaskFormWrapperStyle}>
        <TaskInfoSection
          isInTemplate={isInTemplate}
          isInProject={isInProject}
          groupIds={groupIds}
          parentEntity={parentEntity}
          task={task}
        />

        <ProjectSection />
        <ParentEntity inParentEntityForm={inParentEntityForm} entity={entity} />
      </div>
    );
  }
}
