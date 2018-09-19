// @flow
import { Container } from 'unstated';
import { removeTypename } from 'utils/data';
import { isEquals } from 'utils/fp';

type FormState = {
  entityTypes?: Array<{
    name: string,
    icon: string,
    color: string,
  }>,
};

const initValues = {
  entityTypes: [],
};

export default class TagEntityTypeContainer extends Container<FormState> {
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

  initDetailValues = (entityTypes: Array<Object>) => {
    const parsedValues = removeTypename(entityTypes);
    // $FlowFixMe: missing type for ramda's map function
    this.setState({ entityTypes: parsedValues });
    this.originalValues = { entityTypes: parsedValues };
  };
}
