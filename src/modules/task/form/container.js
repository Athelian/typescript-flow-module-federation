// @flow
import { Container } from 'unstated';
import { cleanFalsy } from 'utils/data';
import { isEquals } from 'utils/fp';

type FormState = {
  name?: string,
  dueDate?: ?string,
  startDate?: ?string,
  description?: ?string,
  tags?: Array<Object>,
  memo?: ?string,
  assignedTo?: Array<Object>,
  inProgressBy?: ?Object,
  inProgressAt?: ?string,
  completedBy?: ?Object,
  completedAt?: ?string,
  approvers?: Array<Object>,
  approvable?: boolean,
  rejectedBy?: ?Object,
  rejectedAt?: ?string,
  approvedBy?: ?Object,
  approvedAt?: ?string,
};

export const initValues = {
  name: null,
  dueDate: null,
  startDate: null,
  description: null,
  tags: [],
  memo: null,
  assignedTo: [],
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

export default class TaskContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(cleanFalsy(this.state), cleanFalsy(this.originalValues));

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

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...initValues, ...values };
    this.setState(parsedValues);
    this.originalValues = Object.assign({}, parsedValues);
  };
}
