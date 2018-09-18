// @flow
import { Container } from 'unstated';
import update from 'immutability-helper';
import { isEquals } from 'utils/fp';
import { removeTypename } from 'utils/data';

type FormState = {
  containerGroups: Array<Object>,
};

const initValues = {
  containerGroups: [{}],
};

export default class ShipmentGroupsContainer extends Container<FormState> {
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

  setFieldArrayValue = (index: number, value: any) => {
    this.setState(prevState =>
      update(prevState, {
        containerGroups: {
          [index]: {
            $merge: value,
          },
        },
      })
    );
  };

  initDetailValues = (containerGroups: Array<Object>) => {
    const parsedValues = removeTypename(containerGroups);
    // $FlowFixMe: missing type for ramda's map function
    this.setState({ containerGroups: parsedValues });
    this.originalValues = { containerGroups: parsedValues };
  };
}
