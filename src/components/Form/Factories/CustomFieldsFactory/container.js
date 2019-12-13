// @flow
import { Container } from 'unstated';
import { cloneDeep, set, unset } from 'lodash';
import { isEquals } from 'utils/fp';
import { cleanFalsyAndTypeName, cleanUpData, removeNulls } from 'utils/data';

type FormState = {
  mask: Object,
  fieldValues: Array<Object>,
  fieldDefinitions: Array<Object>,
};

const initValues = {
  mask: null,
  fieldValues: [],
  fieldDefinitions: [],
};

export default class CustomFieldsContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...initValues, ...cleanUpData(values) };
    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };

  setFieldValue = (path: string, value: any) => {
    this.setState(prevState => {
      return set(cloneDeep(prevState), path, value);
    });
  };

  removeArrayItem = (path: string) => {
    this.setState(prevState => {
      const cloneState = cloneDeep(prevState);
      unset(cloneState, path);
      return removeNulls(cloneState);
    });
  };
}
