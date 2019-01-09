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
  ShipmentInfoContainer,
  ShipmentTagsContainer,
  ShipmentBatchesContainer,
  ShipmentTimelineContainer,
  ShipmentTransportTypeContainer,
  ShipmentFilesContainer,
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
    violations: ?Array<Object>,
    shipment: ?{
      id: string,
    },
  },
|};

type UpdateShipmentResponse = {|
  shipmentUpdate: {
    violations: ?Array<Object>,
    shipment: ?{
      id: string,
    },
  },
|};

type ShipmentFormState = {
  shipmentInfoState: Object,
  shipmentBatchesState: Object,
  shipmentTagsState: Object,
  shipmentTimelineState: Object,
  shipmentTransportTypeState: Object,
  shipmentFileState: Object,
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
    shipmentInfoState,
    shipmentBatchesState,
    shipmentTagsState,
    shipmentTimelineState,
    shipmentTransportTypeState,
    shipmentFileState,
  }: ShipmentFormState) => {
    resetFormState(shipmentInfoState);
    resetFormState(shipmentBatchesState, 'batches');
    resetFormState(shipmentTagsState, 'tags');
    resetFormState(shipmentTimelineState);
    resetFormState(shipmentTransportTypeState, 'transportType');
    resetFormState(shipmentFileState, 'files');
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
    shipmentInfoState,
    shipmentTagsState,
    shipmentTimelineState,
    shipmentTransportTypeState,
    shipmentFileState,
  }: {
    shipmentBatchesState: Object,
    shipmentInfoState: Object,
    shipmentTagsState: Object,
    shipmentTimelineState: Object,
    shipmentTransportTypeState: Object,
    shipmentFileState: Object,
  }) => (shipment: Object) => {
    const {
      batches,
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
      shipmentFileState.initDetailValues([]);
    } else {
      shipmentInfoState.initDetailValues(info);
      shipmentBatchesState.initDetailValues(batches);
      shipmentTimelineState.initDetailValues({
        cargoReady,
        voyages,
        containerGroups,
      });
      shipmentFileState.initDetailValues(files);
    }
    shipmentTagsState.initDetailValues(tags);
    shipmentTransportTypeState.initDetailValues(transportType);
  };

  onMutationCompleted = ({
    shipmentBatchesState,
    shipmentInfoState,
    shipmentTagsState,
    shipmentTimelineState,
    shipmentTransportTypeState,
    shipmentFileState,
  }: {
    shipmentBatchesState: Object,
    shipmentInfoState: Object,
    shipmentTagsState: Object,
    shipmentTimelineState: Object,
    shipmentTransportTypeState: Object,
    shipmentFileState: Object,
  }) => (result: CreateShipmentResponse | UpdateShipmentResponse) => {
    const isNewOrClone = this.isNewOrClone();
    const { redirectAfterSuccess } = this.props;

    if (isNewOrClone && result.shipmentCreate) {
      const {
        shipmentCreate: { shipment, violations },
      } = result;

      if (!violations) {
        if (shipment && shipment.id && redirectAfterSuccess) {
          navigate(`/shipment/${encodeId(shipment.id)}`);
        }
      }
    }
    if (!isNewOrClone && result.shipmentUpdate) {
      const {
        shipmentUpdate: { shipment },
      } = result;
      this.onFormReady({
        shipmentBatchesState,
        shipmentInfoState,
        shipmentTagsState,
        shipmentTimelineState,
        shipmentTransportTypeState,
        shipmentFileState,
      })(shipment);
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
              ShipmentInfoContainer,
              ShipmentTagsContainer,
              ShipmentTimelineContainer,
              ShipmentTransportTypeContainer,
              ShipmentFilesContainer,
              FormContainer,
            ]}
          >
            {(
              shipmentBatchesState,
              shipmentInfoState,
              shipmentTagsState,
              shipmentTimelineState,
              shipmentTransportTypeState,
              shipmentFileState,
              form
            ) => (
              <Mutation
                mutation={isNewOrClone ? createShipmentMutation : updateShipmentMutation}
                onCompleted={this.onMutationCompleted({
                  shipmentBatchesState,
                  shipmentInfoState,
                  shipmentTagsState,
                  shipmentTimelineState,
                  shipmentTransportTypeState,
                  shipmentFileState,
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
                            link="shipmentSection"
                            label={
                              <FormattedMessage
                                id="modules.Shipments.shipment"
                                defaultMessage="SHIPMENT"
                              />
                            }
                            icon="SHIPMENT"
                          />
                          <SectionTabs
                            link="timelineSection"
                            label={
                              <FormattedMessage
                                id="modules.Shipments.timeline"
                                defaultMessage="TIMELINE"
                              />
                            }
                            icon="TIMELINE"
                          />
                          <SectionTabs
                            link="cargoSection"
                            label={
                              <FormattedMessage
                                id="modules.Shipments.cargo"
                                defaultMessage="CARGO"
                              />
                            }
                            icon="CARGO"
                          />
                          <SectionTabs
                            link="documentsSection"
                            label={
                              <FormattedMessage
                                id="modules.Shipments.document"
                                defaultMessage="DOCUMENTS"
                              />
                            }
                            icon="DOCUMENT"
                          />
                          <SectionTabs
                            link="orderSection"
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
                            shipmentInfoState.isDirty() ||
                            shipmentTagsState.isDirty() ||
                            shipmentTimelineState.isDirty() ||
                            shipmentTransportTypeState.isDirty() ||
                            shipmentFileState.isDirty()) && (
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
                                      shipmentInfoState,
                                      shipmentTagsState,
                                      shipmentTimelineState,
                                      shipmentTransportTypeState,
                                      shipmentFileState,
                                    })
                                  }
                                />
                              )}

                              <SaveButton
                                disabled={
                                  !form.isReady(
                                    {
                                      ...shipmentBatchesState.state,
                                      ...shipmentInfoState.state,
                                      ...shipmentTagsState.state,
                                      ...shipmentTimelineState.state,
                                      ...shipmentTransportTypeState.state,
                                      ...shipmentFileState.state,
                                    },
                                    validator
                                  )
                                }
                                isLoading={isLoading}
                                onClick={() =>
                                  this.onSave(
                                    {
                                      ...shipmentBatchesState.state,
                                      ...shipmentInfoState.state,
                                      ...shipmentTagsState.state,
                                      ...shipmentTimelineState.state,
                                      ...shipmentTransportTypeState.state,
                                      ...shipmentFileState.state,
                                    },
                                    saveShipment,
                                    () => {
                                      shipmentBatchesState.onSuccess();
                                      shipmentInfoState.onSuccess();
                                      shipmentTagsState.onSuccess();
                                      shipmentTimelineState.onSuccess();
                                      shipmentTransportTypeState.onSuccess();
                                      shipmentFileState.onSuccess();
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
                                shipmentInfoState,
                                shipmentTagsState,
                                shipmentTimelineState,
                                shipmentTransportTypeState,
                                shipmentFileState,
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
