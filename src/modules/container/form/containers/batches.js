// @flow
import { Container } from 'unstated';
import { set, unset, cloneDeep } from 'lodash';
import update from 'immutability-helper';
import { removeNulls, cleanFalsyAndTypeName } from 'utils/data';
import { isEquals } from 'utils/fp';

type ContainerBatchesContainerState = {
  batches: Array<Object>,
  representativeBatch: ?Object,
};

const initValues: ContainerBatchesContainerState = {
  batches: [],
  representativeBatch: null,
};

export default class ContainerBatchesContainer extends Container<ContainerBatchesContainerState> {
  state = initValues;

  originalValues = initValues;

  existingBatches = initValues.batches;

  addExistingBatches = (batches: Array<Object>) => {
    this.existingBatches = [...this.existingBatches, ...batches];
  };

  removeExistingBatch = (batchId: string) => {
    this.existingBatches = [...this.existingBatches.filter(batch => batch.id !== batchId)];
  };

  removeExistingBatches = (batches: Array<Object>) => {
    this.existingBatches = [
      ...this.existingBatches.filter(existingBatch =>
        batches.some(batch => batch.id !== existingBatch.id)
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

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

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

  setDeepFieldValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
    });
  };

  removeDeepFieldValue = (path: string) => {
    this.setState(prevState => {
      const cloneState = cloneDeep(prevState);
      unset(cloneState, path);
      return removeNulls(cloneState);
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

  initDetailValues = ({ batches, representativeBatch }: ContainerBatchesContainerState) => {
    this.setState({ batches, representativeBatch });
    this.originalValues = { batches, representativeBatch };
    this.existingBatches = batches;
  };
}