// @flow
import type {
  BatchPayload,
  ContainerPayload,
  PartnerPayload,
  OrganizationPayload,
} from 'generated/graphql';
import { Container } from 'unstated';
import update from 'immutability-helper';
import { isEquals, getByPath } from 'utils/fp';

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
        batches.some(batch => getByPath('id', batch) !== getByPath('id', existingBatch))
      ),
    ];
  };

  changeContainerIdToExistingBatches = (
    batches: Array<BatchPayload>,
    container: ContainerPayload
  ) => {
    this.existingBatches = [
      ...this.existingBatches.map(existingBatch =>
        batches.some(batch => getByPath('id', batch) === getByPath('id', existingBatch))
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

  changeMainExporter = (exporter: PartnerPayload) => {
    if (exporter) {
      this.setState(prevState => {
        return {
          batches: prevState.batches.filter(
            batch => getByPath('orderItem.order.exporter.id', batch) === getByPath('id', exporter)
          ),
        };
      });
    } else {
      this.setState(({ followers = [] }) => {
        const cleanedFollowers = followers.filter(
          follower => follower?.organization?.id !== exporter?.id
        );

        return { followers: cleanedFollowers };
      });
    }
  };

  // On change Importer, clean up followers and batches
  onChangeImporter = (prevImporter: ?OrganizationPayload) => {
    if (prevImporter) {
      this.setState(({ followers = [] }) => {
        const cleanedFollowers = followers.filter(
          follower => follower?.organization?.id !== prevImporter?.id
        );

        return { batches: [], followers: cleanedFollowers };
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
