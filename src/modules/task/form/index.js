// @flow
import React from 'react';
import { isEquals } from 'utils/fp';
import TaskInfoSection from './components/TaskInfoSection';

type OptionalProps = {
  task?: Object,
  onFormReady?: () => void,
  isInTemplate: boolean,
};

type Props = OptionalProps & {};

const defaultProps = {
  task: {},
  onFormReady: () => {},
  isInTemplate: false,
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
    const { task, isInTemplate } = this.props;
    return <TaskInfoSection task={task} isInTemplate={isInTemplate} />;
  }
}
