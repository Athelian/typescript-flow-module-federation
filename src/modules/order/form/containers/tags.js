// @flow
import { Container } from 'unstated';
import { removeTypename } from 'utils/data';
import { isEquals } from 'utils/fp';

type FormState = {
  tags?: Array<{
    id: string,
    name: string,
    color: string,
  }>,
};

const initValues = {};

export default class OrderTagsContainer extends Container<FormState> {
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

  initDetailValues = (tags: Array<Object>) => {
    const parsedValues: Array<any> = removeTypename(tags);
    this.setState({
      tags: parsedValues,
    });
    this.originalValues = parsedValues;
  };
}
