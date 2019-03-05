// @flow
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import { cleanFalsy, cleanUpData } from 'utils/data';
import { isEquals } from 'utils/fp';

type ContainersState = {
  containers: Array<Object>,
};

const initValues = {
  containers: [],
};

export default class ShipmentContainersContainer extends Container<ContainersState> {
  state = initValues;

  originalValues = initValues;

  existingBatchesInContainers = initValues.containers;

  addExistingBatchesToContainer = (containerId: string, batches: Array<Object>) => {
    const containerIndex = this.existingBatchesInContainers.findIndex(
      container => container.id === containerId
    );

    this.existingBatchesInContainers[containerIndex].batches = [
      ...this.existingBatchesInContainers[containerIndex].batches,
      ...batches,
    ];
  };

  removeExistingBatchFromContainer = (containerId: string, batchId: string) => {
    const containerIndex = this.existingBatchesInContainers.findIndex(
      container => container.id === containerId
    );

    this.existingBatchesInContainers[containerIndex].batches = [
      ...this.existingBatchesInContainers[containerIndex].batches.filter(
        batch => batch.id !== batchId
      ),
    ];
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

  isDirty = () => !isEquals(cleanFalsy(this.state), cleanFalsy(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  initDetailValues = (values: Object) => {
    const parsedValues = { ...initValues, ...cleanUpData(values) };

    this.setState(parsedValues);
    this.originalValues = parsedValues;
    this.existingBatchesInContainers = parsedValues.containers.map(({ id, batches }) => ({
      id,
      batches,
    }));
  };
}
