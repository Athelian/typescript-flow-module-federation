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

const initValues = {
  tags: [],
};

export default class ShipmentTagsContainer extends Container<FormState> {
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
    const parsedValues = removeTypename(tags);
    // $FlowFixMe: missing type for ramda's map function
    this.setState({ tags: parsedValues });
    this.originalValues = { tags: parsedValues };
  };
}
