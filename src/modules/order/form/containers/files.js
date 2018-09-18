// @flow
import { Container } from 'unstated';
import { removeTypename } from 'utils/data';
import { isEquals } from 'utils/fp';
import * as Yup from 'yup';
import { cloneDeep, set } from 'lodash';
import type { Document } from 'components/Form/DocumentsInput/type.js.flow';

type FormState = {
  files?: Array<Document>,
};

const initValues = {
  files: [],
};

export default class OrderFilesContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
  };

  setFieldValue = (path: string, value: mixed) => {
    this.setState((prevState: FormState): FormState => set(cloneDeep(prevState), path, value));
  };

  initDetailValues = (files: Array<Document>) => {
    const parsedValues = removeTypename(files);
    // $FlowFixMe: missing type for ramda's map function
    this.setState({ files: parsedValues });
    this.originalValues = { files: parsedValues };
  };

  validationRules = () => Yup.object().shape({});
}
