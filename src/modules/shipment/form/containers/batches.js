// @flow
import type { BatchPayload, ContainerPayload, OrganizationPayload } from 'generated/graphql';
import { Container } from 'unstated';
import update from 'immutability-helper';
import { isEquals } from 'utils/fp';

type BatchFormState = {|
  batches: Array<BatchPayload>,
  hasCalledBatchesApiYet: boolean,
|};

const initValues: BatchFormState = {
  batches: [],
  hasCalledBatchesApiYet: false,
};

export default class ShipmentBatchesContainer extends Container<BatchFormState> {
  state = initValues;

  originalValues = initValues;

  existingBatches = initValues.batches;

  addExistingBatches = (batches: Array<BatchPayload>) => {
    this.existingBatches = [...this.existingBatches, ...batches];
  };

  removeExistingBatches = (batches: Array<BatchPayload>) => {
    this.existingBatches = [
      ...this.existingBatches.filter(existingBatch =>
        batches.some(batch => batch?.id === existingBatch?.id)
      ),
    ];
  };

  changeContainerIdToExistingBatches = (
    batches: Array<BatchPayload>,
    container: ContainerPayload
  ) => {
    this.existingBatches = [
      ...this.existingBatches.map(existingBatch =>
        batches.some(batch => batch?.id === existingBatch?.id)
          ? update(existingBatch, { container: { $set: container } })
          : existingBatch
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

  initDetailValues = (batches: Array<BatchPayload>, hasCalledBatchesApiYet: boolean = false) => {
    this.setState({ batches, hasCalledBatchesApiYet });
    this.originalValues = { batches, hasCalledBatchesApiYet };
    this.existingBatches = batches;
  };

  changeMainExporter = (prevExporter: ?OrganizationPayload, exporter: ?OrganizationPayload) => {
    if (exporter) {
      this.setState(prevState => {
        return {
          batches: prevState.batches.filter(
            batch => batch?.orderItem?.order?.exporter?.id === exporter?.id
          ),
        };
      });
    } else if (prevExporter) {
      this.setState(prevState => {
        const cleanedBatches = prevState.batches.map(batch => {
          const { followers: batchFollowers = [] } = batch;

          const cleanedBatchFollowers = batchFollowers.filter(
            follower => follower?.organization?.id !== prevExporter.id
          );

          return {
            ...batch,
            followers: cleanedBatchFollowers,
          };
        });
        return { batches: cleanedBatches };
      });
    }
  };

  // On change Importer, clean up followers and batches
  onChangeImporter = (prevImporter: ?OrganizationPayload) => {
    if (prevImporter) {
      this.setState({
        batches: [],
      });
    }
  };

  onChangeForwarders = (
    prevForwarders: Array<OrganizationPayload> = [],
    newForwarders: Array<OrganizationPayload> = []
  ) => {
    const removedForwarders = prevForwarders.filter(
      prevForwarder => !newForwarders.some(newForwarder => newForwarder.id === prevForwarder.id)
    );

    if (prevForwarders.length > 0 && removedForwarders.length > 0) {
      this.setState(({ batches = [] }) => {
        const cleanedBatches = batches.map(batch => {
          const { followers: batchFollowers = [] } = batch;

          const cleanedBatchFollowers = batchFollowers.filter(
            follower =>
              !removedForwarders.some(
                removedForwarder => removedForwarder.id === follower?.organization?.id
              )
          );

          return {
            ...batch,
            followers: cleanedBatchFollowers,
          };
        });
        return { batches: cleanedBatches };
      });
    }
  };
}
