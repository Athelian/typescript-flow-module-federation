// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { Query, Mutation } from 'react-apollo';
// import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import Setting from 'modules/setting';
import { UIConsumer } from 'modules/ui';
import { FormContainer } from 'modules/form';
import Layout from 'components/Layout';
import { SaveButton, CancelButton } from 'components/NavButtons';
import NavBar, { EntityIcon } from 'components/NavBar';
import LoadingIcon from 'components/LoadingIcon';
// import SlideView from 'components/SlideView';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { encodeId, decodeId } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import logger from 'utils/logger';
import {
  ShipmentInfoContainer,
  ShipmentTagsContainer,
  ShipmentBatchesContainer,
  ShipmentGroupsContainer,
  ShipmentVoyagesContainer,
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

  onSave = (formData: Object, saveShipment: Function, onSuccess: Function = () => {}) => {
    const { shipmentId } = this.props;

    const isNew = shipmentId === 'new';
    const input = isNew
      ? prepareCreateShipmentInput(formData)
      : prepareUpdateShipmentInput(formData);

    if (isNew) {
      saveShipment({ variables: { input } });
    } else if (shipmentId) {
      saveShipment({ variables: { input, id: decodeId(shipmentId) } });
    }
    onSuccess();
  };

  onMutationCompleted = (result: Object) => {
    const { shipmentId } = this.props;
    const isNew = shipmentId === 'new';

    if (isNew) {
      const {
        shipmentCreate: { shipment, violations },
      } = result;
      if (violations && violations.length) {
        logger.warn(violations);
        return;
      }

      navigate(`/shipment/${encodeId(shipment.id)}`);
    }
    logger.warn('result', result);
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
                      </JumpToSection>
                      <Subscribe
                        to={[
                          ShipmentBatchesContainer,
                          ShipmentInfoContainer,
                          ShipmentTagsContainer,
                          ShipmentGroupsContainer,
                          ShipmentVoyagesContainer,
                          FormContainer,
                        ]}
                      >
                        {(
                          shipmentBatchesState,
                          shipmentInfoState,
                          shipmentTagsState,
                          shipmentGroupsState,
                          shipmentVoyagesState,
                          form
                        ) =>
                          (isNew ||
                            shipmentBatchesState.isDirty() ||
                            shipmentInfoState.isDirty() ||
                            shipmentTagsState.isDirty()) && (
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
                                      ...shipmentGroupsState.state,
                                      ...shipmentVoyagesState.state,
                                    },
                                    saveShipment,
                                    () => {
                                      shipmentBatchesState.onSuccess();
                                      shipmentInfoState.onSuccess();
                                      shipmentTagsState.onSuccess();
                                      shipmentGroupsState.onSuccess();
                                      shipmentVoyagesState.onSuccess();
                                      form.onReset();
                                    }
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
                        ShipmentGroupsContainer,
                        ShipmentVoyagesContainer,
                      ]}
                    >
                      {(
                        shipmentBatchesState,
                        shipmentInfoState,
                        shipmentTagsState,
                        shipmentGroupsState,
                        shipmentVoyagesState
                      ) => (
                        <Query
                          query={query}
                          variables={{ id: decodeId(shipmentId) }}
                          fetchPolicy="network-only"
                          onCompleted={result => {
                            const {
                              shipment: { batches, tags, voyages, containerGroups, ...info },
                            } = result;
                            shipmentBatchesState.initDetailValues(batches);
                            shipmentTagsState.initDetailValues(tags);
                            shipmentInfoState.initDetailValues(info);
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
