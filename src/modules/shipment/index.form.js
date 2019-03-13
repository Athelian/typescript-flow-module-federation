// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { pick } from 'lodash';
import { Subscribe } from 'unstated';
import { toast } from 'react-toastify';
import { BooleanValue } from 'react-values';
import { Mutation } from 'react-apollo';
import { findChangeData } from 'utils/data';
import { QueryForm } from 'components/common';
import { navigate } from '@reach/router';
import { UIConsumer } from 'modules/ui';
import { UserConsumer } from 'modules/user';
import { FormContainer, resetFormState } from 'modules/form';
import Layout from 'components/Layout';
import SlideView from 'components/SlideView';
import { SaveButton, CancelButton, ResetButton, ExportButton } from 'components/Buttons';
import NavBar, { EntityIcon, SlideViewNavBar, LogsButton } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { encodeId, decodeId } from 'utils/id';
import { ShipmentEventsList } from 'modules/history';
import { shipmentExportQuery } from './query';
import {
  ShipmentBatchesContainer,
  ShipmentContainersContainer,
  ShipmentFilesContainer,
  ShipmentInfoContainer,
  ShipmentTagsContainer,
  ShipmentTimelineContainer,
  ShipmentTransportTypeContainer,
  ShipmentTasksContainer,
} from './form/containers';
import ShipmentForm from './form';
import validator from './form/validator';
import { shipmentFormQuery } from './form/query';
import {
  createShipmentMutation,
  prepareCreateShipmentInput,
  updateShipmentMutation,
  prepareParsedUpdateShipmentInput,
} from './form/mutation';

type OptionalProps = {
  path: string,
  shipmentId: string,
  anchor: string,
  isSlideView: boolean,
  onSuccessCallback: ?Function,
  redirectAfterSuccess: boolean,
  onCancel?: Function,
};

type Props = OptionalProps & {};

const defaultProps = {
  path: '',
  shipmentId: '',
  anchor: '',
  isSlideView: false,
  onSuccessCallback: null,
  redirectAfterSuccess: true,
};

type CreateShipmentResponse = {|
  shipmentCreate: {
    violations?: Array<Object>,
    id?: string,
  },
|};

type UpdateShipmentResponse = {|
  shipmentUpdate: {
    violations?: Array<Object>,
    id?: string,
  },
|};

type ShipmentFormState = {
  shipmentInfoContainer: Object,
  shipmentTagsContainer: Object,
  shipmentTransportTypeContainer: Object,
  shipmentTimelineContainer: Object,
  shipmentBatchesContainer: Object,
  shipmentContainersContainer: Object,
  shipmentFilesContainer: Object,
  shipmentTasksContainer: Object,
};

class ShipmentFormModule extends React.Component<Props> {
  static defaultProps = defaultProps;

  isNew = () => {
    const { path } = this.props;
    return path.startsWith('new');
  };

  isClone = () => {
    const { path } = this.props;
    return path.startsWith('clone');
  };

  isNewOrClone = () => this.isNew() || this.isClone();

  onCancel = () => navigate(`/shipment`);

  onReset = ({
    shipmentInfoContainer,
    shipmentTagsContainer,
    shipmentTransportTypeContainer,
    shipmentTimelineContainer,
    shipmentBatchesContainer,
    shipmentContainersContainer,
    shipmentFilesContainer,
    shipmentTasksContainer,
    form,
  }: ShipmentFormState & { form: Object }) => {
    resetFormState(shipmentInfoContainer);
    resetFormState(shipmentTagsContainer, 'tags');
    resetFormState(shipmentTransportTypeContainer, 'transportType');
    resetFormState(shipmentTimelineContainer);
    resetFormState(shipmentBatchesContainer, 'batches');
    resetFormState(shipmentContainersContainer);
    resetFormState(shipmentFilesContainer, 'files');
    resetFormState(shipmentTasksContainer, 'tasks');
    form.onReset();
  };

  onSave = async (
    originalValues: Object,
    existingBatches: Array<Object>,
    newValues: Object,
    saveShipment: Function,
    onSuccess: () => void,
    onErrors: (Array<Object>) => void
  ) => {
    const { shipmentId, onSuccessCallback } = this.props;

    const isNewOrClone = this.isNewOrClone();

    const input = isNewOrClone
      ? prepareCreateShipmentInput({
          ...findChangeData(originalValues, newValues),
          ...pick(newValues, ['batches', 'importer', 'forwarders', 'voyages', 'containerGroups']),
        })
      : prepareParsedUpdateShipmentInput({
          originalValues,
          existingBatches,
          newValues,
        });

    if (isNewOrClone) {
      const result = await saveShipment({
        variables: { input },
      });
      if (result && result.data) {
        const { data } = result;
        if (data.shipmentCreate) {
          const {
            shipmentCreate: { violations },
          } = data;
          if (violations && violations.length) {
            onErrors(violations);
          } else {
            onSuccess();
            if (onSuccessCallback) {
              onSuccessCallback(data);
            }
          }
        }
      }
    } else if (shipmentId) {
      const result = await saveShipment({
        variables: { input, id: decodeId(shipmentId) },
      });
      if (result && result.data) {
        const { data } = result;
        if (data.shipmentUpdate) {
          const {
            shipmentUpdate: { violations },
          } = data;
          if (violations && violations.length) {
            onErrors(violations);
          } else {
            onSuccess();
          }
        }
      }
    }
  };

  onFormReady = ({
    shipmentInfoContainer,
    shipmentTagsContainer,
    shipmentTransportTypeContainer,
    shipmentTimelineContainer,
    shipmentBatchesContainer,
    shipmentContainersContainer,
    shipmentFilesContainer,
    shipmentTasksContainer,
  }: ShipmentFormState) => (shipment: Object) => {
    const {
      batches,
      containers,
      tags,
      transportType,
      cargoReady,
      voyages,
      containerGroups,
      files,
      todo,
      ...info
    }: Object = shipment;
    if (this.isClone()) {
      const { bookingDate, blDate, no, ...cloneInfo } = info;
      shipmentInfoContainer.initDetailValues({
        ...cloneInfo,
        no: `[cloned] ${no}`,
      });
      shipmentFilesContainer.initDetailValues([]);
    } else {
      shipmentInfoContainer.initDetailValues(info);
      shipmentBatchesContainer.initDetailValues(batches);
      shipmentContainersContainer.initDetailValues({ containers });
      shipmentTimelineContainer.initDetailValues({
        cargoReady,
        voyages,
        containerGroups,
      });
      shipmentFilesContainer.initDetailValues(files);
    }
    shipmentTagsContainer.initDetailValues(tags);
    shipmentTasksContainer.initDetailValues(todo);
    shipmentTransportTypeContainer.initDetailValues(transportType);
  };

  onMutationCompleted = ({
    shipmentInfoContainer,
    shipmentTagsContainer,
    shipmentTransportTypeContainer,
    shipmentTimelineContainer,
    shipmentBatchesContainer,
    shipmentContainersContainer,
    shipmentFilesContainer,
    shipmentTasksContainer,
  }: ShipmentFormState) => (result: CreateShipmentResponse | UpdateShipmentResponse) => {
    const { redirectAfterSuccess } = this.props;

    if (!result) {
      toast.error('There was an error. Please try again later');
      return;
    }

    if (result.shipmentCreate) {
      const { shipmentCreate } = result;

      if (!shipmentCreate.violations) {
        if (shipmentCreate.id && redirectAfterSuccess) {
          navigate(`/shipment/${encodeId(shipmentCreate.id)}`);
        }
      }
    }

    if (result.shipmentUpdate) {
      const { shipmentUpdate } = result;
      if (!shipmentUpdate.violations) {
        this.onFormReady({
          shipmentInfoContainer,
          shipmentTagsContainer,
          shipmentTransportTypeContainer,
          shipmentTimelineContainer,
          shipmentBatchesContainer,
          shipmentContainersContainer,
          shipmentFilesContainer,
          shipmentTasksContainer,
        })(shipmentUpdate);
      }
    }
  };

  render() {
    const { shipmentId, anchor, isSlideView, onCancel } = this.props;
    const isNewOrClone = this.isNewOrClone();
    let mutationKey = {};
    if (shipmentId && !isNewOrClone) {
      mutationKey = { key: decodeId(shipmentId) };
    }
    const CurrentNavBar = isSlideView ? SlideViewNavBar : NavBar;

    return (
      <UIConsumer>
        {uiState => (
          <Subscribe
            to={[
              ShipmentInfoContainer,
              ShipmentTagsContainer,
              ShipmentTransportTypeContainer,
              ShipmentTimelineContainer,
              ShipmentBatchesContainer,
              ShipmentContainersContainer,
              ShipmentFilesContainer,
              ShipmentTasksContainer,
              FormContainer,
            ]}
          >
            {(
              shipmentInfoContainer,
              shipmentTagsContainer,
              shipmentTransportTypeContainer,
              shipmentTimelineContainer,
              shipmentBatchesContainer,
              shipmentContainersContainer,
              shipmentFilesContainer,
              shipmentTasksContainer,
              form
            ) => (
              <Mutation
                mutation={isNewOrClone ? createShipmentMutation : updateShipmentMutation}
                onCompleted={this.onMutationCompleted({
                  shipmentInfoContainer,
                  shipmentTagsContainer,
                  shipmentTransportTypeContainer,
                  shipmentTimelineContainer,
                  shipmentBatchesContainer,
                  shipmentContainersContainer,
                  shipmentFilesContainer,
                  shipmentTasksContainer,
                })}
                {...mutationKey}
              >
                {(saveShipment, { loading: isLoading, error: apiError }) => {
                  const isDirty =
                    shipmentInfoContainer.isDirty() ||
                    shipmentTagsContainer.isDirty() ||
                    shipmentTransportTypeContainer.isDirty() ||
                    shipmentTimelineContainer.isDirty() ||
                    shipmentBatchesContainer.isDirty() ||
                    shipmentContainersContainer.isDirty() ||
                    shipmentFilesContainer.isDirty() ||
                    shipmentTasksContainer.isDirty();
                  return (
                    <Layout
                      {...(isSlideView ? {} : uiState)}
                      navBar={
                        <CurrentNavBar>
                          <EntityIcon icon="SHIPMENT" color="SHIPMENT" />
                          <JumpToSection>
                            <SectionTabs
                              link="shipment_shipmentSection"
                              label={
                                <FormattedMessage
                                  id="modules.Shipments.shipment"
                                  defaultMessage="SHIPMENT"
                                />
                              }
                              icon="SHIPMENT"
                            />
                            <SectionTabs
                              link="shipment_timelineSection"
                              label={
                                <FormattedMessage
                                  id="modules.Shipments.timeline"
                                  defaultMessage="TIMELINE"
                                />
                              }
                              icon="TIMELINE"
                            />
                            <SectionTabs
                              link="shipment_cargoSection"
                              label={
                                <FormattedMessage
                                  id="modules.Shipments.cargo"
                                  defaultMessage="CARGO"
                                />
                              }
                              icon="CARGO"
                            />
                            <SectionTabs
                              link="shipment_documentsSection"
                              label={
                                <FormattedMessage
                                  id="modules.Shipments.document"
                                  defaultMessage="DOCUMENTS"
                                />
                              }
                              icon="DOCUMENT"
                            />
                            <SectionTabs
                              link="shipment_taskSection"
                              label={
                                <FormattedMessage
                                  id="modules.Shipments.task"
                                  defaultMessage="TASKS"
                                />
                              }
                              icon="TASK"
                            />
                            <SectionTabs
                              link="shipment_orderSection"
                              label={
                                <FormattedMessage
                                  id="modules.Shipments.order"
                                  defaultMessage="ORDERS"
                                />
                              }
                              icon="ORDER"
                            />
                          </JumpToSection>
                          <BooleanValue>
                            {({ value: opened, set: slideToggle }) =>
                              !isNewOrClone && (
                                <>
                                  <LogsButton onClick={() => slideToggle(true)} />
                                  <SlideView
                                    isOpen={opened}
                                    onRequestClose={() => slideToggle(false)}
                                    options={{ width: '1030px' }}
                                  >
                                    <Layout
                                      navBar={
                                        <SlideViewNavBar>
                                          <EntityIcon icon="LOGS" color="LOGS" />
                                        </SlideViewNavBar>
                                      }
                                    >
                                      {opened && shipmentId ? (
                                        <ShipmentEventsList
                                          id={decodeId(shipmentId)}
                                          perPage={10}
                                        />
                                      ) : null}
                                    </Layout>
                                  </SlideView>
                                </>
                              )
                            }
                          </BooleanValue>
                          {isNewOrClone ? (
                            <CancelButton
                              onClick={() => (onCancel ? onCancel() : this.onCancel())}
                            />
                          ) : (
                            <>
                              {isDirty && (
                                <ResetButton
                                  onClick={() => {
                                    this.onReset({
                                      shipmentInfoContainer,
                                      shipmentTagsContainer,
                                      shipmentTransportTypeContainer,
                                      shipmentTimelineContainer,
                                      shipmentBatchesContainer,
                                      shipmentContainersContainer,
                                      shipmentFilesContainer,
                                      shipmentTasksContainer,
                                      form,
                                    });
                                  }}
                                />
                              )}
                            </>
                          )}

                          {(isNewOrClone || isDirty) && (
                            <SaveButton
                              disabled={
                                !form.isReady(
                                  {
                                    ...shipmentBatchesContainer.state,
                                    ...shipmentContainersContainer.state,
                                    ...shipmentFilesContainer.state,
                                    ...shipmentInfoContainer.state,
                                    ...shipmentTagsContainer.state,
                                    ...shipmentTimelineContainer.state,
                                    ...shipmentTransportTypeContainer.state,
                                    ...shipmentTasksContainer.state,
                                  },
                                  validator
                                )
                              }
                              isLoading={isLoading}
                              onClick={() => {
                                this.onSave(
                                  {
                                    ...shipmentBatchesContainer.originalValues,
                                    ...shipmentContainersContainer.originalValues,
                                    ...shipmentFilesContainer.originalValues,
                                    ...shipmentInfoContainer.originalValues,
                                    ...shipmentTagsContainer.originalValues,
                                    ...shipmentTimelineContainer.originalValues,
                                    ...shipmentTransportTypeContainer.originalValues,
                                    ...shipmentTasksContainer.originalValues,
                                  },
                                  shipmentBatchesContainer.existingBatches,
                                  {
                                    ...shipmentBatchesContainer.state,
                                    ...shipmentContainersContainer.state,
                                    ...shipmentFilesContainer.state,
                                    ...shipmentInfoContainer.state,
                                    ...shipmentTagsContainer.state,
                                    ...shipmentTimelineContainer.state,
                                    ...shipmentTransportTypeContainer.state,
                                    ...shipmentTasksContainer.state,
                                  },
                                  saveShipment,
                                  () => {
                                    shipmentBatchesContainer.onSuccess();
                                    shipmentContainersContainer.onSuccess();
                                    shipmentFilesContainer.onSuccess();
                                    shipmentInfoContainer.onSuccess();
                                    shipmentTagsContainer.onSuccess();
                                    shipmentTimelineContainer.onSuccess();
                                    shipmentTransportTypeContainer.onSuccess();
                                    shipmentTasksContainer.onSuccess();
                                    form.onReset();
                                  },
                                  form.onErrors
                                );
                              }}
                            />
                          )}
                          {shipmentId && !isDirty && !isNewOrClone && (
                            <ExportButton
                              type="Shipment"
                              exportQuery={shipmentExportQuery}
                              variables={{ id: decodeId(shipmentId) }}
                            />
                          )}
                        </CurrentNavBar>
                      }
                    >
                      {apiError && <p>Error: Please try again.</p>}
                      {this.isNew() || !shipmentId ? (
                        <UserConsumer>
                          {({ user }) => {
                            const { group } = user;
                            const { types = [] } = group;
                            const isImporter = types.includes('Importer');
                            const isForwarder = types.includes('Forwarder');
                            return (
                              <ShipmentForm
                                shipment={{}}
                                isNew
                                onFormReady={() => {
                                  shipmentInfoContainer.initDetailValues({
                                    importer: isImporter ? group : {},
                                    forwarders: isForwarder ? [group] : [],
                                  });
                                }}
                              />
                            );
                          }}
                        </UserConsumer>
                      ) : (
                        <QueryForm
                          query={shipmentFormQuery}
                          entityId={shipmentId}
                          entityType="shipment"
                          render={(shipment, isOwner) => (
                            <ShipmentForm
                              isOwner={isOwner}
                              isClone={this.isClone()}
                              shipment={shipment}
                              anchor={anchor}
                              onFormReady={() => {
                                this.onFormReady({
                                  shipmentInfoContainer,
                                  shipmentTagsContainer,
                                  shipmentTransportTypeContainer,
                                  shipmentTimelineContainer,
                                  shipmentBatchesContainer,
                                  shipmentContainersContainer,
                                  shipmentFilesContainer,
                                  shipmentTasksContainer,
                                })(shipment);
                              }}
                            />
                          )}
                        />
                      )}
                    </Layout>
                  );
                }}
              </Mutation>
            )}
          </Subscribe>
        )}
      </UIConsumer>
    );
  }
}

export default ShipmentFormModule;
