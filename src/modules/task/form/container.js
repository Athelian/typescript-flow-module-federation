// @flow
import { Container } from 'unstated';
import { cleanFalsyAndTypeName } from 'utils/data';
import { isEquals } from 'utils/fp';

type FormState = {
  name: ?string,
  startDate?: ?string,
  startDateInterval?: ?Object,
  startDateBinding?: ?string,
  dueDate?: ?string,
  dueDateInterval?: ?Object,
  dueDateBinding?: ?string,
  description?: ?string,
  tags?: Array<Object>,
  memo?: ?string,
  inProgressBy?: ?Object,
  inProgressAt?: ?string,
  skippedBy?: ?Object,
  skippedAt?: ?string,
  completedBy?: ?Object,
  completedAt?: ?string,
  approvers?: Array<Object>,
  approvable?: boolean,
  rejectedBy?: ?Object,
  rejectedAt?: ?string,
  approvedBy?: ?Object,
  approvedAt?: ?string,
};

export const initValues: FormState = {
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

export default class TaskContainer extends Container<FormState> {
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

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...initValues, ...values };
    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };
}
