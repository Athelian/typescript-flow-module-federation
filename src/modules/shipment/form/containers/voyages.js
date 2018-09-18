// @flow
import { Container } from 'unstated';
import update from 'immutability-helper';
import { isEquals } from 'utils/fp';
import { removeTypename } from 'utils/data';

type FormState = {
  voyages: Array<Object>,
};

const initValues = {
  voyages: [{}],
};

export default class ShipmentVoyagesContainer extends Container<FormState> {
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
        voyages: {
          [index]: {
            $merge: value,
          },
        },
      })
    );
  };

  initDetailValues = (voyages: Array<Object>) => {
    const parsedValues = removeTypename(voyages);
    // $FlowFixMe: missing type for ramda's map function
    this.setState({ voyages: parsedValues });
    this.originalValues = { voyages: parsedValues };
  };
}
