// @flow
import React from 'react';
import { isEquals } from 'utils/fp';

import TaskSection from './components/TaskSection';

type OptionalProps = {
  isNew?: boolean,
  task?: Object,
  onFormReady?: () => void,
};

type Props = OptionalProps & {};

const defaultProps = {
  isNew: false,
  task: {},
  onFormReady: () => {},
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
    const { isNew, task } = this.props;
    return <TaskSection isNew={isNew} task={task} />;
  }
}
