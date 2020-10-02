// @flow
import type { Task } from 'generated/graphql';
import { Container } from 'unstated';
import { cleanFalsyAndTypeName, extractForbiddenId } from 'utils/data';
import { isEquals } from 'utils/fp';
import { initDatetimeToContainer } from 'utils/date';

export const initValues: Task = {
  name: null,
  startDate: null,
  startDateInterval: null,
  startDateBinding: null,
  dueDate: null,
  dueDateInterval: null,
  dueDateBinding: null,
  description: null,
  tags: [],
  memo: null,
  inProgressBy: null,
  inProgressAt: null,
  completedBy: null,
  completedAt: null,
  approvers: [],
  approvable: false,
  rejectedBy: null,
  rejectedAt: null,
  approvedBy: null,
  approvedAt: null,
};

export default class TaskContainer extends Container<Task> {
  state = initValues;

  originalValues = initValues;

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  setFieldValues = (values: Object) => {
    this.setState(values);
  };

  initDetailValues = (values: Object, timezone: string) => {
    const {
      startDate,
      dueDate,
      inProgressAt,
      completedAt,
      rejectedAt,
      approvedAt,
      ...rest
    } = values;
    const info = {
      ...initDatetimeToContainer(startDate, 'startDate', timezone),
      ...initDatetimeToContainer(dueDate, 'dueDate', timezone),
      ...initDatetimeToContainer(inProgressAt, 'inProgressAt', timezone),
      ...initDatetimeToContainer(completedAt, 'completedAt', timezone),
      ...initDatetimeToContainer(rejectedAt, 'rejectedAt', timezone),
      ...initDatetimeToContainer(approvedAt, 'approvedAt', timezone),
      ...rest,
    };

    const parsedValues = { ...initValues, ...info };

    const parsedTags = [...parsedValues.tags.map(tag => extractForbiddenId(tag))];
    this.setState({ ...parsedValues, tags: parsedTags });
    this.originalValues = { ...parsedValues, tags: parsedTags };
  };
}
