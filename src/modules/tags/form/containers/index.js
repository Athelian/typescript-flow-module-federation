// @flow
import { Container } from 'unstated';
import * as Yup from 'yup';
import { removeTypename } from 'utils/data';
import { isEquals } from 'utils/fp';

type FormState = {
  name?: string,
  description?: string,
  color?: string,
};

const initValues = {};

export default class TagContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  initDetailValues = (values: Object) => {
    const parsedValues = removeTypename(values);
    // $FlowFixMe: missing type for ramda's map function
    this.setState(parsedValues);
    this.originalValues = parsedValues;
  };

  validationRules = () =>
    Yup.object().shape({
      name: Yup.string().required(),
      color: Yup.string().required(),
    });
}
