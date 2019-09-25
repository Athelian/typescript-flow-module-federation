// @flow
import type { FilePayload } from 'generated/graphql';
import { Container } from 'unstated';
import { extractForbiddenId } from 'utils/data';
import { isEquals } from 'utils/fp';
import { cloneDeep, set } from 'lodash';

type FormState = {|
  files: Array<FilePayload>,
|};

const initValues: FormState = {
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
    // FIXME: find a bug, https://app.asana.com/0/1128234177716832/1141298576337241/f
    const parsedFiles = [...files.map(file => extractForbiddenId(file))];
    this.setState({ files: parsedFiles });
    this.originalValues = { files: parsedFiles };
  };
}
