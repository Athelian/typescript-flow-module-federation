// @flow
import { Container } from 'unstated';
import { cleanFalsyAndTypeName } from 'utils/data';
import { isEquals } from 'utils/fp';

type FormState = {
  name: string,
  dueDate: string,
  description?: string,
  completedAt?: string,
  completedBy?: Object,
};

const initValues = {
  name: null,
  dueDate: null,
  description: null,
  completedAt: null,
  completedBy: null,
};

export default class MilestoneStateContainer extends Container<FormState> {
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

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...initValues, ...values };
    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };
}
