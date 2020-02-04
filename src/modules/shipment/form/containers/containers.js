// @flow
import type { ContainerPayload, OrganizationPayload, PartnerPayload } from 'generated/graphql';
import { Container } from 'unstated';
import { cloneDeep, set } from 'lodash';
import { cleanFalsyAndTypeName } from 'utils/data';
import { getByPath, getByPathWithDefault, isEquals } from 'utils/fp';

type ContainersState = {|
  containers: Array<ContainerPayload>,
  hasCalledContainerApiYet: boolean,
|};

export const initValues: ContainersState = {
  containers: [],
  hasCalledContainerApiYet: false,
};

export default class ShipmentContainersContainer extends Container<ContainersState> {
  state = initValues;

  originalValues = initValues;

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  setDeepFieldValue = (path: string, value: any) => {
    this.setState(prevState => set(cloneDeep(prevState), path, value));
  };

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  initDetailValues = (
    containers: Array<ContainerPayload>,
    hasCalledContainerApiYet: boolean = false
  ) => {
    this.setState({ containers, hasCalledContainerApiYet });
    this.originalValues = { containers, hasCalledContainerApiYet };
  };

  changeMainExporter = (exporter: ?OrganizationPayload) => {
    if (exporter) {
      this.setState(prevState => {
        return {
          containers: prevState.containers.map(container => {
            const { batches, representativeBatch, ...rest } = container;
            const newBatches = batches.filter(
              batch => getByPath('orderItem.order.exporter.id', batch) === getByPath('id', exporter)
            );
            const newRepresentativeBatch = newBatches
              .map(batch => batch.id)
              .includes(getByPathWithDefault('', 'id', representativeBatch))
              ? representativeBatch
              : newBatches[0];
            return {
              batches: newBatches,
              representativeBatch: newRepresentativeBatch,
              ...rest,
            };
          }),
        };
      });
    }
  };

  waitForContainerSectionReadyThenChangePartner = (partner: PartnerPayload) => {
    let retry;
    if (this.state.hasCalledContainerApiYet) {
      this.onChangePartner(partner);
    } else {
      const waitForApiReady = () => {
        if (this.state.hasCalledContainerApiYet) {
          this.onChangePartner(partner);
          cancelAnimationFrame(retry);
        } else {
          retry = requestAnimationFrame(waitForApiReady);
        }
      };
      retry = requestAnimationFrame(waitForApiReady);
    }
  };

  waitForContainerSectionReadyThenChangeMainExporter = (exporter: ?OrganizationPayload) => {
    let retry;
    if (this.state.hasCalledContainerApiYet) {
      this.changeMainExporter(exporter);
    } else {
      const waitForApiReady = () => {
        if (this.state.hasCalledContainerApiYet) {
          this.changeMainExporter(exporter);
          cancelAnimationFrame(retry);
        } else {
          retry = requestAnimationFrame(waitForApiReady);
        }
      };
      retry = requestAnimationFrame(waitForApiReady);
    }
  };

  onChangePartner = (partner: PartnerPayload) => {
    this.setState(prevState => ({
      containers: prevState.containers.map(container => ({
        ...container,
        warehouseArrivalActualDateApprovedAt:
          getByPath('warehouseArrivalActualDateApprovedBy.organization.id', container) ===
          getByPath('id', partner)
            ? null
            : container.warehouseArrivalActualDateApprovedAt,
        warehouseArrivalActualDateApprovedBy:
          getByPath('warehouseArrivalActualDateApprovedBy.organization.id', container) ===
          getByPath('id', partner)
            ? null
            : container.warehouseArrivalActualDateApprovedBy,
        warehouseArrivalAgreedDateApprovedAt:
          getByPath('warehouseArrivalAgreedDateApprovedBy.organization.id', container) ===
          getByPath('id', partner)
            ? null
            : container.warehouseArrivalAgreedDateApprovedAt,
        warehouseArrivalAgreedDateApprovedBy:
          getByPath('warehouseArrivalAgreedDateApprovedBy.organization.id', container) ===
          getByPath('id', partner)
            ? null
            : container.warehouseArrivalAgreedDateApprovedBy,
        departureDateApprovedAt:
          getByPath('departureDateApprovedBy.organization.id', container) ===
          getByPath('id', partner)
            ? null
            : container.departureDateApprovedAt,
        departureDateApprovedBy:
          getByPath('departureDateApprovedBy.organization.id', container) ===
          getByPath('id', partner)
            ? null
            : container.departureDateApprovedBy,
      })),
    }));
  };
}
