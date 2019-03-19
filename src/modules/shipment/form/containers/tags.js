// @flow
import { Container } from 'unstated';
import { isEquals } from 'utils/fp';

type FormState = {
  tags?: Array<{
    id: string,
    name: string,
    color: string,
  }>,
};

const initValues = {
  tags: [],
};

export default class ShipmentTagsContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  initDetailValues = (tags: Array<Object>) => {
    this.setState({ tags });
    this.originalValues = { tags };
  };
}
