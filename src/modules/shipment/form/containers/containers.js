// @flow
import type { ContainerPayload, OrganizationPayload } from 'generated/graphql';
import { Container } from 'unstated';
import { cloneDeep, set } from 'lodash';
import { cleanFalsyAndTypeName } from 'utils/data';
import { isEquals } from 'utils/fp';

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

  // On change Importer, clean up followers and batches
  onChangeImporter = (prevImporter: ?OrganizationPayload) => {
    if (prevImporter) {
      this.setState(({ containers = [] }) => {
        const cleanedContainers = containers.map(container => {
          return {
            ...container,
            batches: [],
          };
        });

        return { containers: cleanedContainers };
      });
    }
  };

  // On change Exporter, clean up followers and batches
  onChangeExporter = (prevExporter: ?OrganizationPayload, newExporter: ?OrganizationPayload) => {
    this.setState(({ containers = [] }) => {
      const cleanedContainers = containers.map(container => {
        const { batches = [], representativeBatch } = container;

        if (prevExporter) {
          // When Exporter is removed
          if (!newExporter) {
            return {
              ...container,
              batches,
            };
          }

          // When Exporter is changed to different Exporter
          return {
            ...container,
            batches: [],
            representativeBatch: null,
          };
        }

        // When there is no Exporter and Exporter is added
        const filteredBatches = batches.filter(
          batch => batch?.orderItem?.order?.exporter?.id === prevExporter?.id
        );
        const newRepresentativeBatch = filteredBatches.some(
          batch => batch?.id === representativeBatch?.id
        )
          ? representativeBatch
          : filteredBatches?.[0] ?? null;

        return {
          ...container,
          batches: filteredBatches,
          representativeBatch: newRepresentativeBatch,
        };
      });

      return { containers: cleanedContainers };
    });
  };

  onChangeForwarders = (
    prevForwarders: Array<OrganizationPayload> = [],
    newForwarders: Array<OrganizationPayload> = []
  ) => {
    const removedForwarders = prevForwarders.filter(
      prevForwarder => !newForwarders.some(newForwarder => newForwarder.id === prevForwarder.id)
    );

    if (prevForwarders.length > 0 && removedForwarders.length > 0) {
      this.setState(({ containers = [] }) => {
        const cleanedContainers = containers.map(container => {
          const { batches = [] } = container;

          return { ...container, batches };
        });

        return { containers: cleanedContainers };
      });
    }
  };
}
