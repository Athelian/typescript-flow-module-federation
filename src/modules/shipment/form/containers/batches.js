// @flow
import type { BatchPayload, ContainerPayload, OrganizationPayload } from 'generated/graphql';
import { Container } from 'unstated';
import update from 'immutability-helper';
import { isEquals } from 'utils/fp';
import { initDatetimeToContainer } from 'utils/date';

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

  initDetailValues = (
    batches: Array<BatchPayload>,
    hasCalledBatchesApiYet: boolean = false,
    timezone: string
  ) => {
    const parsedBatches: Array<Object> = batches.map(batch => ({
      ...batch,
      ...initDatetimeToContainer(batch?.deliveredAt ?? null, 'deliveredAt', timezone),
      ...initDatetimeToContainer(batch?.desiredAt ?? null, 'desiredAt', timezone),
      ...initDatetimeToContainer(batch?.expiredAt ?? null, 'expiredAt', timezone),
      ...initDatetimeToContainer(batch?.producedAt ?? null, 'producedAt', timezone),
    }));

    this.setState({ batches: parsedBatches, hasCalledBatchesApiYet });
    this.originalValues = { batches: parsedBatches, hasCalledBatchesApiYet };
    this.existingBatches = parsedBatches;
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
}
