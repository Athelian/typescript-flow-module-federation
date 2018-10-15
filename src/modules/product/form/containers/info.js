// @flow
import { Container } from 'unstated';
import { isEquals } from 'utils/fp';
import { cleanUpData, cleanFalsy } from 'utils/data';

type FormState = {
  name?: string,
  serial?: string,
  janCode?: ?string,
  hsCode?: ?string,
  material?: ?string,
  metadata?: Array<Object>,
};

const initValues = {
  metadata: [],
};

export default class ProductInfoContainer extends Container<FormState> {
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
    const parsedValues: Object = cleanUpData(values);
    this.setState(parsedValues);
    this.originalValues = Object.assign({}, parsedValues);
  };
}
