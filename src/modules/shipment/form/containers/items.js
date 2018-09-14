// @flow
import { Container } from 'unstated';
import update from 'immutability-helper';
import { isEquals } from 'utils/fp';
import { removeTypename } from 'utils/data';

type FormState = {
  batches: Array<Object>,
};

const initValues = {
  batches: [],
};

export default class ShipmentItemsContainer extends Container<FormState> {
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
        batches: {
          [index]: {
            $merge: value,
          },
        },
      })
    );
  };

  initDetailValues = (batches: Array<Object>) => {
    const parsedValues = removeTypename(batches);
    // $FlowFixMe: missing type for ramda's map function
    this.setState({ batches: parsedValues });
    this.originalValues = { batches: parsedValues };
  };
}
