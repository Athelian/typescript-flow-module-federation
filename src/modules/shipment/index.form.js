// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { QueryForm } from 'components/common';
import { navigate } from '@reach/router';
import { UIConsumer } from 'modules/ui';
import { FormContainer } from 'modules/form';
import Layout from 'components/Layout';
import { SaveButton, CancelButton, ExportButton } from 'components/Buttons';
import NavBar, { EntityIcon } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { encodeId, decodeId } from 'utils/id';
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
  isSlideView: boolean,
};
type Props = OptionalProps & {
  path: string,
  shipmentId?: string,
};

const defaultProps = {
  shipmentId: '',
  isSlideView: false,
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

  onCancel = () => {
    navigate(`/shipment`);
  };

  onSave = async (
    formData: Object,
    saveShipment: any => Promise<?{ data?: CreateShipmentResponse | UpdateShipmentResponse }>,
    onSuccess: () => void,
    onErrors: (Array<Object>) => void
  ) => {
    const { shipmentId } = this.props;

    const isNewOrClone = this.isClone() || this.isNew();
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

  onMutationCompleted = (result: CreateShipmentResponse | UpdateShipmentResponse) => {
    const isNewOrClone = this.isNew() || this.isClone();

    if (isNewOrClone && result.shipmentCreate) {
      const {
        shipmentCreate: { shipment, violations },
      } = result;

      if (!violations) {
        if (shipment && shipment.id) {
          navigate(`/shipment/${encodeId(shipment.id)}`);
        }
      }
    }
  };

  render() {
    const { shipmentId, isSlideView } = this.props;
    const isNewOrClone = this.isNew() || this.isClone();
    let mutationKey = {};
    if (shipmentId && !isNewOrClone) {
      mutationKey = { key: decodeId(shipmentId) };
    }

    return (
      <Provider>
        <UIConsumer>
          {uiState => (
            <Mutation
              mutation={isNewOrClone ? createShipmentMutation : updateShipmentMutation}
              onCompleted={this.onMutationCompleted}
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
                              id="modules.shipment.shipment"
                              defaultMessage="SHIPMENT"
                            />
                          }
                          icon="SHIPMENT"
                        />
                        <SectionTabs
                          link="timelineSection"
                          label={
                            <FormattedMessage
                              id="modules.shipment.timeline"
                              defaultMessage="TIMELINE"
                            />
                          }
                          icon="TIMELINE"
                        />
                        <SectionTabs
                          link="cargoSection"
                          label={
                            <FormattedMessage id="modules.shipment.cargo" defaultMessage="CARGO" />
                          }
                          icon="CARGO"
                        />
                        <SectionTabs
                          link="documentsSection"
                          label={
                            <FormattedMessage
                              id="modules.shipment.document"
                              defaultMessage="DOCUMENTS"
                            />
                          }
                          icon="DOCUMENT"
                        />
                        <SectionTabs
                          link="orderSection"
                          label={
                            <FormattedMessage id="modules.shipment.order" defaultMessage="ORDERS" />
                          }
                          icon="ORDER"
                        />
                      </JumpToSection>
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
                          <>
                            {(isNewOrClone ||
                              shipmentBatchesState.isDirty() ||
                              shipmentInfoState.isDirty() ||
                              shipmentTagsState.isDirty() ||
                              shipmentTimelineState.isDirty() ||
                              shipmentTransportTypeState.isDirty() ||
                              shipmentFileState.isDirty()) && (
                              <>
                                <CancelButton onClick={this.onCancel} />
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
                                  type="data"
                                  format="csv"
                                  template="ShipmentID"
                                  id={decodeId(shipmentId)}
                                />
                              )}
                          </>
                        )}
                      </Subscribe>
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
                        <Subscribe
                          to={[
                            ShipmentBatchesContainer,
                            ShipmentInfoContainer,
                            ShipmentTagsContainer,
                            ShipmentTimelineContainer,
                            ShipmentTransportTypeContainer,
                            ShipmentFilesContainer,
                          ]}
                        >
                          {(
                            shipmentBatchesState,
                            shipmentInfoState,
                            shipmentTagsState,
                            shipmentTimelineState,
                            shipmentTransportTypeState,
                            shipmentFileState
                          ) => (
                            <ShipmentForm
                              isClone={this.isClone()}
                              shipment={shipment}
                              onFormReady={() => {
                                const {
                                  batches,
                                  tags,
                                  transportType,
                                  cargoReady,
                                  voyages,
                                  containerGroups,
                                  files,
                                  ...info
                                } = shipment;
                                if (this.isClone()) {
                                  const { bookingDate, blDate, no, ...cloneInfo } = info;
                                  shipmentInfoState.initDetailValues({
                                    ...cloneInfo,
                                    no: `[cloned] ${no}`,
                                  });
                                } else {
                                  shipmentInfoState.initDetailValues(info);
                                  shipmentBatchesState.initDetailValues(batches);
                                  shipmentTimelineState.initDetailValues({
                                    cargoReady,
                                    voyages,
                                    containerGroups,
                                  });
                                }
                                shipmentTagsState.initDetailValues(tags);
                                shipmentTransportTypeState.initDetailValues(transportType);
                                shipmentFileState.initDetailValues(files);
                              }}
                            />
                          )}
                        </Subscribe>
                      )}
                    />
                  )}
                </Layout>
              )}
            </Mutation>
          )}
        </UIConsumer>
      </Provider>
    );
  }
}

export default ShipmentFormModule;
