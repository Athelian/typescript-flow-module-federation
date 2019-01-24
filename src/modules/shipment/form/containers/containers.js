// @flow
import { Container } from 'unstated';
import update from 'immutability-helper';
import { isEquals } from 'utils/fp';
import { removeTypename } from 'utils/data';

type ContainersState = {
  containers: Array<Object>,
};

const initValues = {
  containers: [],
};

export default class ShipmentContainersContainer extends Container<ContainersState> {
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

  setFieldArrayValue = (index: number, value: any) => {
    this.setState(prevState =>
      update(prevState, {
        containers: {
          [index]: {
            $merge: value,
          },
        },
      })
    );
  };

  initDetailValues = (containers: Array<Object>) => {
    const parsedValues: Array<any> = removeTypename(containers);
    this.setState({ containers: parsedValues });
    this.originalValues = { containers: parsedValues };
  };
}
