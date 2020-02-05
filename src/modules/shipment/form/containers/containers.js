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
          const { followers } = container;
          const cleanedFollowers = followers.filter(
            follower => follower?.organization?.id !== prevImporter?.id
          );

          return {
            ...container,
            batches: [],
            followers: cleanedFollowers,
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
        const { followers = [], batches = [], representativeBatch } = container;

        if (prevExporter) {
          const cleanedFollowers = followers.filter(
            follower => follower?.organization?.id !== prevExporter?.id
          );

          // When Exporter is removed
          if (!newExporter) {
            const cleanedBatches = batches.map(batch => {
              const { followers: batchFollowers = [] } = batch;

              const cleanedBatchFollowers = batchFollowers.filter(
                follower => follower?.organization?.id !== prevExporter?.id
              );

              return {
                ...batch,
                followers: cleanedBatchFollowers,
              };
            });

            return {
              ...container,
              batches: cleanedBatches,
              followers: cleanedFollowers,
            };
          }

          // When Exporter is changed to different Exporter
          return {
            ...container,
            batches: [],
            representativeBatch: null,
            followers: cleanedFollowers,
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

  // On change Forwarders, clean up followers and followers in batches
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
          const { followers = [], batches = [] } = container;

          const cleanedFollowers = followers.filter(
            follower =>
              !removedForwarders.some(
                removedForwarder => removedForwarder.id === follower?.organization?.id
              )
          );

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

          return { ...container, batches: cleanedBatches, followers: cleanedFollowers };
        });

        return { containers: cleanedContainers };
      });
    }
  };

  waitForContainerSectionReadyThenChangeImporter = (prevImporter: ?OrganizationPayload) => {
    if (prevImporter) {
      const { hasCalledContainerApiYet } = this.state;
      let retry;

      if (hasCalledContainerApiYet) {
        this.onChangeImporter(prevImporter);
      } else {
        const waitForApiReady = () => {
          if (hasCalledContainerApiYet) {
            this.onChangeImporter(prevImporter);
            cancelAnimationFrame(retry);
          } else {
            retry = requestAnimationFrame(waitForApiReady);
          }
        };
        retry = requestAnimationFrame(waitForApiReady);
      }
    }
  };

  waitForContainerSectionReadyThenChangeExporter = (
    prevExporter: ?OrganizationPayload,
    newExporter: ?OrganizationPayload
  ) => {
    const { hasCalledContainerApiYet } = this.state;
    let retry;

    if (hasCalledContainerApiYet) {
      this.onChangeExporter(prevExporter, newExporter);
    } else {
      const waitForApiReady = () => {
        if (hasCalledContainerApiYet) {
          this.onChangeExporter(prevExporter, newExporter);
          cancelAnimationFrame(retry);
        } else {
          retry = requestAnimationFrame(waitForApiReady);
        }
      };
      retry = requestAnimationFrame(waitForApiReady);
    }
  };

  waitForContainerSectionReadyThenChangeForwarders = (
    prevForwarders: Array<OrganizationPayload> = [],
    newForwarders: Array<OrganizationPayload> = []
  ) => {
    if (prevForwarders.length > 0) {
      const { hasCalledContainerApiYet } = this.state;
      let retry;

      if (hasCalledContainerApiYet) {
        this.onChangeForwarders(prevForwarders, newForwarders);
      } else {
        const waitForApiReady = () => {
          if (hasCalledContainerApiYet) {
            this.onChangeForwarders(prevForwarders, newForwarders);
            cancelAnimationFrame(retry);
          } else {
            retry = requestAnimationFrame(waitForApiReady);
          }
        };
        retry = requestAnimationFrame(waitForApiReady);
      }
    }
  };
}
