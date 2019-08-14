// @flow
import { Container } from 'unstated';
import { cleanFalsyAndTypeName, cleanUpData } from 'utils/data';
import { isEquals } from 'utils/fp';

type FormState = {
  name: string,
  memo: string,
  type: string,
  fields: Array<string>,
};

const initValues = {
  name: '',
  memo: '',
  type: 'Order',
  fields: [],
};

export default class TemplateFormContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  onCleanUp = () => {
    this.setState(initValues);
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...initValues, ...cleanUpData(values) };
    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };

  hasSelectField = (selectedField: string) => this.state.fields.includes(selectedField);

  toggleSelectField = (selectedField: string) => {
    const { fields } = this.state;
    if (fields.includes(selectedField)) {
      this.setState({
        fields: fields.filter(item => item !== selectedField),
      });
    } else {
      this.setState({
        fields: [...fields, selectedField],
      });
    }
  };
}
