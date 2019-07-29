// @flow
import type { FilePayload } from 'generated/graphql';
import { Container } from 'unstated';
import { isEquals } from 'utils/fp';
import { cloneDeep, set } from 'lodash';

type FormState = {
  files: Array<FilePayload>,
};

const initValues = {
  files: [],
};

export default class OrderItemFilesContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  setFieldValue = (path: string, value: mixed) => {
    this.setState((prevState: FormState): FormState => set(cloneDeep(prevState), path, value));
  };

  initDetailValues = (files: Array<FilePayload>) => {
    this.setState({ files });
    this.originalValues = { files };
  };
}
