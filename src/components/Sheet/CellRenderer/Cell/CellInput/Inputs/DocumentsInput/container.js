// @flow
import type { FilePayload } from 'generated/graphql';
import { Container } from 'unstated';
import { extractForbiddenId } from 'utils/data';

type FormState = {|
  files: Array<FilePayload>,
|};

const initValues: FormState = {
  files: [],
};

export default class DocumentsContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  setFieldValue = (files: Array<FilePayload>) => {
    this.setState({ files });
  };

  initDetailValues = (files: Array<FilePayload>) => {
    const parsedFiles = [...files.map(file => extractForbiddenId(file))];
    this.setState({ files: parsedFiles });
    this.originalValues = { files: parsedFiles };
  };
}
