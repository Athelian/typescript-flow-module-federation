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
  updatedAt?: string,
  updatedBy?: Object,
  type?: string,
};

export const initValues = {
  type: '',
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
};

export default class TaskTemplateFormContainer extends Container<FormState> {
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

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...initValues, ...cleanUpData(values) };
    this.setState(parsedValues);
    this.originalValues = Object.assign({}, parsedValues);
  };
}
