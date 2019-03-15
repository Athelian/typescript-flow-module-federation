// @flow
import React from 'react';
import { isEquals } from 'utils/fp';
import TaskSection from './components/TaskSection';
import { TaskFormWrapperStyle } from './style';

type OptionalProps = {
  task?: Object,
  onFormReady?: () => void,
};

type Props = OptionalProps & {};

const defaultProps = {
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
    const { task } = this.props;
    return (
      <div className={TaskFormWrapperStyle}>
        <TaskSection task={task} />
      </div>
    );
  }
}
