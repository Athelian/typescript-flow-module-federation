// @flow
import { Container } from 'unstated';
import { cleanFalsy, cleanUpData } from 'utils/data';
import { isEquals } from 'utils/fp';

type FormState = {
  name?: string,
  duDate?: string,
  startDate?: string,
  description?: string,
  tags?: Array<Object>,
  memo?: string,
  assignedTo?: Array<Object>,
  inProgressBy?: Object,
  inProgressAt?: string,
  completedBy?: Object,
  completedAt?: string,
  approvers?: Array<Object>,
  approvable?: boolean,
  rejectedBy?: Object,
  rejectedAt?: string,
  approvedBy?: Object,
  approvedAt?: string,
  updatedAt?: string,
  updatedBy?: Object,
};

export const initValues = {
  dueDate: '',
  startDate: '',
  description: '',
  name: '',
  memo: '',
  tags: [],
  assignedTo: [],
  inProgressBy: null,
  completedAt: null,
  completedBy: null,
  updatedAt: null,
  updatedBy: null,
  approvers: [],
  approvable: null,
  rejectedAt: null,
  rejectedBy: null,
  approvedAt: null,
  approvedBy: null,
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
    const parsedValues: Object = { ...initValues, ...cleanUpData(values) };
    this.setState(parsedValues);
    this.originalValues = Object.assign({}, parsedValues);
  };
}
