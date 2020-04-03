// @flow
import React from 'react';
import { isEquals } from 'utils/fp';
import TaskInfoSection from './components/TaskInfoSection';
import ProjectSection from './components/ProjectSection';
import ParentEntity from './components/ParentEntity';
import { TaskFormWrapperStyle } from './style';
import EntitySection from './components/EntitySection';

type Props = {|
  // eslint-disable-next-line react/no-unused-prop-types
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
          parentEntity={parentEntity}
          task={task}
        />

        {!isInTemplate && !isInProject && <ProjectSection parentEntity={entity?.__typename} />}

        {!isInTemplate && !inParentEntityForm && <EntitySection task={task} entity={entity} />}

        <ParentEntity inParentEntityForm={inParentEntityForm} entity={entity} />
      </div>
    );
  }
}
