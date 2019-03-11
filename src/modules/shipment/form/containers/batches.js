// @flow
import { Container } from 'unstated';
import update from 'immutability-helper';
import { isEquals } from 'utils/fp';
import { removeTypename } from 'utils/data';

type BatchFormState = {
  batches: Array<Object>,
};

const initValues = {
  batches: [],
};

export default class ShipmentBatchesContainer extends Container<BatchFormState> {
  state = initValues;

  originalValues = initValues;

  existingBatches = initValues.batches;

  addExistingBatches = (batches: Array<Object>) => {
    this.existingBatches = [...this.existingBatches, ...batches];
  };

  removeExistingBatches = (batches: Array<Object>) => {
    this.existingBatches = [
      ...this.existingBatches.filter(existingBatch =>
        batches.some(batch => batch.id === existingBatch.id)
      ),
    ];
  };

  changeContainerIdToExistingBatches = (batches: Array<Object>, container: ?Object) => {
    this.existingBatches = [
      ...this.existingBatches.map(existingBatch =>
        batches.some(batch => batch.id === existingBatch.id)
          ? { ...existingBatch, container }
          : { ...existingBatch }
      ),
    ];
  };

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = this.state;
    this.existingBatches = this.state.batches;
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
        batches: {
          [index]: {
            $merge: value,
          },
        },
      })
    );
  };

  initDetailValues = (batches: Array<Object>) => {
    const parsedValues: Array<any> = removeTypename(batches);

    this.setState({ batches: parsedValues });
    this.originalValues = { batches: parsedValues };
    this.existingBatches = parsedValues;
  };
}
