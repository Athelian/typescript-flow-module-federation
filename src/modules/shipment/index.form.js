// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { Query, Mutation } from 'react-apollo';
import { navigate } from '@reach/router';
import Setting from 'modules/setting';
import { UIConsumer } from 'modules/ui';
import { FormContainer } from 'modules/form';
import Layout from 'components/Layout';
import { SaveButton, CancelButton } from 'components/NavButtons';
import NavBar, { EntityIcon } from 'components/NavBar';
import LoadingIcon from 'components/LoadingIcon';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { encodeId, decodeId } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import {
  ShipmentInfoContainer,
  ShipmentTagsContainer,
  ShipmentBatchesContainer,
  ShipmentTimelineContainer,
  ShipmentTransportTypeContainer,
} from './form/containers';
import ShipmentForm from './form';
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

class ShipmentFormModule extends React.Component<Props> {
  static defaultProps = defaultProps;

  onCancel = () => {
    navigate(`/shipment`);
  };

  onSave = async (
    formData: Object,
    saveShipment: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { shipmentId } = this.props;

    const isNew = shipmentId === 'new';
    const input = isNew
      ? prepareCreateShipmentInput(formData)
      : prepareUpdateShipmentInput(formData);

    if (isNew) {
      const { data } = await saveShipment({ variables: { input } });
      const {
        shipmentCreate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
      }
    } else if (shipmentId) {
      const { data } = await saveShipment({ variables: { input, id: decodeId(shipmentId) } });
      const {
        shipmentUpdate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
      }
    }
  };

  onMutationCompleted = (result: Object) => {
    const { shipmentId } = this.props;
    const isNew = shipmentId === 'new';

    if (isNew) {
      const {
        shipmentCreate: { shipment, violations },
      } = result;

      if (!violations) {
        navigate(`/shipment/${encodeId(shipment.id)}`);
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
                    <NavBar setting={<Setting />}>
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
                              <CancelButton disabled={false} onClick={this.onCancel}>
                                Cancel
                              </CancelButton>
                              <SaveButton
                                disabled={!form.isReady()}
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
                              >
                                Save
                              </SaveButton>
                            </>
                          )
                        }
                      </Subscribe>
                    </NavBar>
                  }
                >
                  {isLoading && <LoadingIcon />}
                  {apiError && <p>Error: Please try again.</p>}
                  {isNew || !shipmentId ? (
                    <ShipmentForm shipment={{}} isNew />
                  ) : (
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
                        <Query
                          query={query}
                          variables={{ id: decodeId(shipmentId) }}
                          fetchPolicy="network-only"
                          onCompleted={result => {
                            if (result.shipment) {
                              const {
                                shipment: { batches, tags, voyages, containerGroups, ...info },
                              } = result;
                              shipmentBatchesState.initDetailValues(batches);
                              shipmentTagsState.initDetailValues(tags);
                              shipmentInfoState.initDetailValues(info);
                            } else {
                              navigate('/shipment');
                            }
                              shipmentGroupsState.initDetailValues(containerGroups);
                              shipmentVoyagesState.initDetailValues(voyages);
                          }}
                        >
                          {({ loading, data, error }) => {
                            if (error) {
                              return error.message;
                            }

                            if (loading) return <LoadingIcon />;
                            return (
                              <ShipmentForm shipment={getByPathWithDefault({}, 'shipment', data)} />
                            );
                          }}
                        </Query>
                      )}
                    </Subscribe>
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
