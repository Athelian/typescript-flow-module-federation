// @flow
import { Container } from 'unstated';

export type LoginFormState = {
  email?: string,
  password?: string,
};

const initValues = {};

export default class LoginFormContainer extends Container<LoginFormState> {
  state = initValues;

  originalValues = initValues;

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  isDirty = () => Object.keys(this.state).length > 0;

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };
}
