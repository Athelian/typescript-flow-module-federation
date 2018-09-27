// @flow
import { Container } from 'unstated';
import { removeTypename } from 'utils/data';
import { isEquals } from 'utils/fp';

type FormState = {
  entityTypes: Array<string>,
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
    this.setState(this.originalValues);
  };

  toggleSelectType = (name: string) => {
    this.setState(({ entityTypes }) => ({
      entityTypes: entityTypes.includes(name)
        ? (entityTypes.filter(item => item !== name): Array<string>)
        : ([...entityTypes, name]: Array<string>),
    }));
  };

  initDetailValues = (entityTypes: Array<string>) => {
    const parsedValues: Array<any> = removeTypename(entityTypes);
    this.setState({ entityTypes: parsedValues });
    this.originalValues = { entityTypes: parsedValues };
  };
}
