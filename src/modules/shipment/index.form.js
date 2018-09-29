// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import QueryDetail from 'components/common/QueryDetail';
import { navigate } from '@reach/router';
import { UIConsumer } from 'modules/ui';
import { FormContainer } from 'modules/form';
import Layout from 'components/Layout';
import { SaveButton, CancelButton } from 'components/Buttons';
import NavBar, { EntityIcon } from 'components/NavBar';
import LoadingIcon from 'components/LoadingIcon';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { encodeId, decodeId } from 'utils/id';
import {
  ShipmentInfoContainer,
  ShipmentTagsContainer,
  ShipmentBatchesContainer,
  ShipmentTimelineContainer,
  ShipmentTransportTypeContainer,
} from './form/containers';
import ShipmentForm from './form';
import validator from './form/validator';
import query from './form/query';
import {
  createShipmentMutation,
  prepareCreateShipmentInput,
  updateShipmentMutation,
  prepareUpdateShipmentInput,
} from './form/mutation';

type Props = {
  shipmentId?: string,
};

const defaultProps = {
  shipmentId: '',
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

    const isNew = shipmentId === 'new';
    const input = isNew
      ? prepareCreateShipmentInput(formData)
      : prepareUpdateShipmentInput(formData);

    if (isNew) {
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
    const { shipmentId } = this.props;
    const isNew = shipmentId === 'new';

    if (isNew && result.shipmentCreate) {
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
    const { shipmentId } = this.props;
    const isNew = shipmentId === 'new';
    let mutationKey = {};
    if (shipmentId && !isNew) {
      mutationKey = { key: decodeId(shipmentId) };
    }

    return (
      <Provider>
        <UIConsumer>
          {uiState => (
            <Mutation
              mutation={isNew ? createShipmentMutation : updateShipmentMutation}
              onCompleted={this.onMutationCompleted}
              {...mutationKey}
            >
              {(saveShipment, { loading: isLoading, error: apiError }) => (
                <Layout
                  {...uiState}
                  navBar={
                    <NavBar>
                      <EntityIcon icon="SHIPMENT" color="SHIPMENT" />
                      <JumpToSection>
                        <SectionTabs link="shipmentSection" label="SHIPMENT" icon="SHIPMENT" />
                        <SectionTabs link="timelineSection" label="TIMELINE" icon="TIMELINE" />
                        <SectionTabs link="cargoSection" label="CARGO" icon="CARGO" />
                        <SectionTabs link="orderSection" label="ORDER" icon="ORDER" />
                      </JumpToSection>
                      <Subscribe
                        to={[
                          ShipmentBatchesContainer,
                          ShipmentInfoContainer,
                          ShipmentTagsContainer,
                          ShipmentTimelineContainer,
                          ShipmentTransportTypeContainer,
                          FormContainer,
                        ]}
                      >
                        {(
                          shipmentBatchesState,
                          shipmentInfoState,
                          shipmentTagsState,
                          shipmentTimelineState,
                          shipmentTransportTypeState,
                          form
                        ) =>
                          (isNew ||
                            shipmentBatchesState.isDirty() ||
                            shipmentInfoState.isDirty() ||
                            shipmentTagsState.isDirty() ||
                            shipmentTimelineState.isDirty() ||
                            shipmentTransportTypeState.isDirty()) && (
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
                                    },
                                    validator
                                  )
                                }
                                onClick={() =>
                                  this.onSave(
                                    {
                                      ...shipmentBatchesState.state,
                                      ...shipmentInfoState.state,
                                      ...shipmentTagsState.state,
                                      ...shipmentTimelineState.state,
                                      ...shipmentTransportTypeState.state,
                                    },
                                    saveShipment,
                                    () => {
                                      shipmentBatchesState.onSuccess();
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
                              {isLoading && <LoadingIcon />}
                            </>
                          )
                        }
                      </Subscribe>
                    </NavBar>
                  }
                >
                  {apiError && <p>Error: Please try again.</p>}
                  {isNew || !shipmentId ? (
                    <ShipmentForm shipment={{}} isNew />
                  ) : (
                    <QueryDetail
                      query={query}
                      detailId={shipmentId}
                      detailType="shipment"
                      render={shipment => (
                        <Subscribe
                          to={[
                            ShipmentBatchesContainer,
                            ShipmentInfoContainer,
                            ShipmentTagsContainer,
                            ShipmentTimelineContainer,
                            ShipmentTransportTypeContainer,
                          ]}
                        >
                          {(
                            shipmentBatchesState,
                            shipmentInfoState,
                            shipmentTagsState,
                            shipmentTimelineState,
                            shipmentTransportTypeState
                          ) => (
                            <ShipmentForm
                              shipment={shipment}
                              onDetailReady={() => {
                                const {
                                  batches,
                                  tags,
                                  transportType,
                                  cargoReady,
                                  voyages,
                                  containerGroups,
                                  ...info
                                } = shipment;
                                shipmentBatchesState.initDetailValues(batches);
                                shipmentInfoState.initDetailValues(info);
                                shipmentTagsState.initDetailValues(tags);
                                shipmentTimelineState.initDetailValues({
                                  cargoReady,
                                  voyages,
                                  containerGroups,
                                });
                                shipmentTransportTypeState.initDetailValues(transportType);
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
