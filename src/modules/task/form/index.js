// @flow
import React from 'react';
import { isEquals } from 'utils/fp';
import TaskInfoSection from './components/TaskInfoSection';
import ParentEntity from './components/ParentEntity';

type OptionalProps = {
  task?: Object,
  entity?: Object,
  onFormReady?: () => void,
  parentEntity?: string,
  hideParentInfo?: boolean,
  isInTemplate: boolean,
  isInProject: boolean,
};

type Props = OptionalProps & {
  groupIds: Array<string>,
};

const defaultProps = {
  task: {},
  onFormReady: () => {},
  isInTemplate: false,
  isInProject: false,
};

export default class TaskForm extends React.Component<Props> {
  static defaultProps = defaultProps;

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
      hideParentInfo,
      isInTemplate,
      isInProject,
    } = this.props;
    return (
      <>
        <TaskInfoSection
          groupIds={groupIds}
          parentEntity={parentEntity}
          task={task}
          isInTemplate={isInTemplate}
          isInProject={isInProject}
        />
        <ParentEntity inForm={!!hideParentInfo} entity={entity} />
      </>
    );
  }
}
