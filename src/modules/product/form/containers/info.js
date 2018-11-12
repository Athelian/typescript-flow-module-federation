// @flow
import { Container } from 'unstated';
import { set, unset, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { removeNulls, cleanFalsy, cleanUpData } from 'utils/data';

type Metadata = {
  key: string,
  value: string,
};

type FormState = {
  name?: string,
  serial?: string,
  janCode?: ?string,
  hsCode?: ?string,
  material?: ?string,
  metadata?: Array<Metadata>,
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

  setFieldArrayValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
    });
  };

  removeArrayItem = (path: string) => {
    this.setState(prevState => {
      const cloneState = cloneDeep(prevState);
      unset(cloneState, path);
      return removeNulls(cloneState);
    });
  };

  initDetailValues = (values: Object) => {
    const parsedValues: Object = cleanUpData(values);
    this.setState(parsedValues);
    this.originalValues = Object.assign({}, parsedValues);
  };
}
