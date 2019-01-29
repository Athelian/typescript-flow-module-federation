// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { Mutation } from 'react-apollo';
import { QueryForm } from 'components/common';
import { navigate } from '@reach/router';
import { UIConsumer } from 'modules/ui';
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
} from './form/containers';
import ShipmentForm from './form';
import validator from './form/validator';
import { shipmentFormQuery } from './form/query';
import {
  createShipmentMutation,
  prepareCreateShipmentInput,
  updateShipmentMutation,
  prepareUpdateShipmentInput,
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
  shipmentBatchesState: Object,
  shipmentContainersContainer: Object,
  shipmentFilesState: Object,
  shipmentInfoState: Object,
  shipmentTagsState: Object,
  shipmentTimelineState: Object,
  shipmentTransportTypeState: Object,
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
    shipmentBatchesState,
    shipmentContainersContainer,
    shipmentFilesState,
    shipmentInfoState,
    shipmentTagsState,
    shipmentTimelineState,
    shipmentTransportTypeState,
  }: ShipmentFormState) => {
    resetFormState(shipmentInfoState);
    resetFormState(shipmentBatchesState, 'batches');
    resetFormState(shipmentContainersContainer, 'containers');
    resetFormState(shipmentFilesState, 'files');
    resetFormState(shipmentTagsState, 'tags');
    resetFormState(shipmentTimelineState);
    resetFormState(shipmentTransportTypeState, 'transportType');
  };

  onSave = async (
    formData: Object,
    saveShipment: any => Promise<?{ data?: CreateShipmentResponse | UpdateShipmentResponse }>,
    onSuccess: () => void,
    onErrors: (Array<Object>) => void
  ) => {
    const { shipmentId, onSuccessCallback } = this.props;

    const isNewOrClone = this.isNewOrClone();
    const input = isNewOrClone
      ? prepareCreateShipmentInput(formData)
      : prepareUpdateShipmentInput(formData);

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
      const result = await saveShipment({ variables: { input, id: decodeId(shipmentId) } });
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
    shipmentBatchesState,
    shipmentContainersContainer,
    shipmentFilesState,
    shipmentInfoState,
    shipmentTagsState,
    shipmentTimelineState,
    shipmentTransportTypeState,
  }: {
    shipmentBatchesState: Object,
    shipmentContainersContainer: Object,
    shipmentFilesState: Object,
    shipmentInfoState: Object,
    shipmentTagsState: Object,
    shipmentTimelineState: Object,
    shipmentTransportTypeState: Object,
  }) => (shipment: Object) => {
    const {
      batches,
      containers,
      tags,
      transportType,
      cargoReady,
      voyages,
      containerGroups,
      files,
      ...info
    }: Object = shipment;
    if (this.isClone()) {
      const { bookingDate, blDate, no, ...cloneInfo } = info;
      shipmentInfoState.initDetailValues({
        ...cloneInfo,
        no: `[cloned] ${no}`,
      });
      shipmentFilesState.initDetailValues([]);
    } else {
      shipmentInfoState.initDetailValues(info);
      shipmentBatchesState.initDetailValues(batches);
      shipmentContainersContainer.initDetailValues({ containers });
      shipmentTimelineState.initDetailValues({
        cargoReady,
        voyages,
        containerGroups,
        containers,
      });
      shipmentFilesState.initDetailValues(files);
    }
    shipmentTagsState.initDetailValues(tags);
    shipmentTransportTypeState.initDetailValues(transportType);
  };

  onMutationCompleted = ({
    shipmentBatchesState,
    shipmentContainersContainer,
    shipmentFilesState,
    shipmentInfoState,
    shipmentTagsState,
    shipmentTimelineState,
    shipmentTransportTypeState,
  }: {
    shipmentBatchesState: Object,
    shipmentContainersContainer: Object,
    shipmentFilesState: Object,
    shipmentInfoState: Object,
    shipmentTagsState: Object,
    shipmentTimelineState: Object,
    shipmentTransportTypeState: Object,
  }) => (result: CreateShipmentResponse | UpdateShipmentResponse) => {
    const isNewOrClone = this.isNewOrClone();
    const { redirectAfterSuccess } = this.props;

    if (isNewOrClone && result.shipmentCreate) {
      const { shipmentCreate } = result;

      if (!shipmentCreate.violations) {
        if (shipmentCreate.id && redirectAfterSuccess) {
          navigate(`/shipment/${encodeId(shipmentCreate.id)}`);
        }
      }
    }
    if (!isNewOrClone && result.shipmentUpdate) {
      const { shipmentUpdate } = result;
      this.onFormReady({
        shipmentBatchesState,
        shipmentContainersContainer,
        shipmentFilesState,
        shipmentInfoState,
        shipmentTagsState,
        shipmentTimelineState,
        shipmentTransportTypeState,
      })(shipmentUpdate);
    }
  };

  render() {
    const { shipmentId, anchor, isSlideView, onCancel } = this.props;
    const isNewOrClone = this.isNewOrClone();
    let mutationKey = {};
    if (shipmentId && !isNewOrClone) {
      mutationKey = { key: decodeId(shipmentId) };
    }

    return (
      <UIConsumer>
        {uiState => (
          <Subscribe
            to={[
              ShipmentBatchesContainer,
              ShipmentContainersContainer,
              ShipmentFilesContainer,
              ShipmentInfoContainer,
              ShipmentTagsContainer,
              ShipmentTimelineContainer,
              ShipmentTransportTypeContainer,
              FormContainer,
            ]}
          >
            {(
              shipmentBatchesState,
              shipmentContainersContainer,
              shipmentFilesState,
              shipmentInfoState,
              shipmentTagsState,
              shipmentTimelineState,
              shipmentTransportTypeState,
              form
            ) => (
              <Mutation
                mutation={isNewOrClone ? createShipmentMutation : updateShipmentMutation}
                onCompleted={this.onMutationCompleted({
                  shipmentBatchesState,
                  shipmentContainersContainer,
                  shipmentFilesState,
                  shipmentInfoState,
                  shipmentTagsState,
                  shipmentTimelineState,
                  shipmentTransportTypeState,
                })}
                {...mutationKey}
              >
                {(saveShipment, { loading: isLoading, error: apiError }) => (
                  <Layout
                    {...(isSlideView ? {} : uiState)}
                    navBar={
                      <NavBar>
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
                                      <ShipmentEventsList id={decodeId(shipmentId)} perPage={10} />
                                    ) : null}
                                  </Layout>
                                </SlideView>
                              </>
                            )
                          }
                        </BooleanValue>
                        <>
                          {(isNewOrClone ||
                            shipmentBatchesState.isDirty() ||
                            shipmentContainersContainer.isDirty() ||
                            shipmentFilesState.isDirty() ||
                            shipmentInfoState.isDirty() ||
                            shipmentTagsState.isDirty() ||
                            shipmentTimelineState.isDirty() ||
                            shipmentTransportTypeState.isDirty()) && (
                            <>
                              {this.isNewOrClone() ? (
                                <CancelButton
                                  onClick={() => (onCancel ? onCancel() : this.onCancel())}
                                />
                              ) : (
                                <ResetButton
                                  onClick={() =>
                                    this.onReset({
                                      shipmentBatchesState,
                                      shipmentContainersContainer,
                                      shipmentFilesState,
                                      shipmentInfoState,
                                      shipmentTagsState,
                                      shipmentTimelineState,
                                      shipmentTransportTypeState,
                                    })
                                  }
                                />
                              )}

                              <SaveButton
                                disabled={
                                  !form.isReady(
                                    {
                                      ...shipmentBatchesState.state,
                                      ...shipmentContainersContainer.state,
                                      ...shipmentFilesState.state,
                                      ...shipmentInfoState.state,
                                      ...shipmentTagsState.state,
                                      ...shipmentTimelineState.state,
                                      ...shipmentTransportTypeState.state,
                                    },
                                    validator
                                  )
                                }
                                isLoading={isLoading}
                                onClick={() =>
                                  this.onSave(
                                    {
                                      ...shipmentBatchesState.state,
                                      ...shipmentContainersContainer.state,
                                      ...shipmentFilesState.state,
                                      ...shipmentInfoState.state,
                                      ...shipmentTagsState.state,
                                      ...shipmentTimelineState.state,
                                      ...shipmentTransportTypeState.state,
                                    },
                                    saveShipment,
                                    () => {
                                      shipmentBatchesState.onSuccess();
                                      shipmentContainersContainer.onSuccess();
                                      shipmentFilesState.onSuccess();
                                      shipmentInfoState.onSuccess();
                                      shipmentTagsState.onSuccess();
                                      shipmentTimelineState.onSuccess();
                                      shipmentTransportTypeState.onSuccess();
                                      form.onReset();
                                    },
                                    form.onErrors
                                  )
                                }
                              />
                            </>
                          )}
                          {shipmentId &&
                            !isNewOrClone &&
                            !shipmentBatchesState.isDirty() &&
                            !shipmentContainersContainer.isDirty() &&
                            !shipmentFilesState.isDirty() &&
                            !shipmentInfoState.isDirty() &&
                            !shipmentTagsState.isDirty() &&
                            !shipmentTimelineState.isDirty() &&
                            !shipmentTransportTypeState.isDirty() && (
                              <ExportButton
                                type="Shipment"
                                exportQuery={shipmentExportQuery}
                                variables={{ id: decodeId(shipmentId) }}
                              />
                            )}
                        </>
                      </NavBar>
                    }
                  >
                    {apiError && <p>Error: Please try again.</p>}
                    {this.isNew() || !shipmentId ? (
                      <ShipmentForm shipment={{}} isNew />
                    ) : (
                      <QueryForm
                        query={shipmentFormQuery}
                        entityId={shipmentId}
                        entityType="shipment"
                        render={shipment => (
                          <ShipmentForm
                            isClone={this.isClone()}
                            shipment={shipment}
                            anchor={anchor}
                            onFormReady={() => {
                              this.onFormReady({
                                shipmentBatchesState,
                                shipmentContainersContainer,
                                shipmentFilesState,
                                shipmentInfoState,
                                shipmentTagsState,
                                shipmentTimelineState,
                                shipmentTransportTypeState,
                              })(shipment);
                            }}
                          />
                        )}
                      />
                    )}
                  </Layout>
                )}
              </Mutation>
            )}
          </Subscribe>
        )}
      </UIConsumer>
    );
  }
}

export default ShipmentFormModule;
