// @flow
import { Container } from 'unstated';
import { isEquals } from 'utils/fp';
import { cleanFalsy, cleanUpData } from 'utils/data';

export type BatchFormState = {
  metadata: {
    key: string,
    value: string,
  },
};

const initValues = {
  metadata: {
    key: 'METADATA 1',
    value: '',
  },
};

export default class BatchFormContainer extends Container<BatchFormState> {
  state = initValues;

  originalValues = initValues;

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  isDirty = () => !isEquals(cleanFalsy(this.state), cleanFalsy(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...initValues, ...cleanUpData(values) };
    this.setState(parsedValues);
    this.originalValues = Object.assign({}, parsedValues);
  };
}
