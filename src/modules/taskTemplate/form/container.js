// @flow
import { Container } from 'unstated';
import { cloneDeep, set } from 'lodash';
import { cleanFalsy } from 'utils/data';
import { isEquals } from 'utils/fp';

type FormState = {
  name?: string,
  description?: string,
  entityType?: string,
  tasks?: Array<Object>,
};

const initValues = {
  tasks: [],
};

export default class TaskTemplateFormContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(cleanFalsy(this.state), cleanFalsy(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  setFieldValue = (path: string, value: mixed) => {
    this.setState((prevState: FormState): FormState => set(cloneDeep(prevState), path, value));
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
