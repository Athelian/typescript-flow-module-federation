// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { Query, Mutation } from 'react-apollo';
// import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import { FormContainer } from 'modules/form';
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
  ShipmentItemsContainer,
  ShipmentInfoContainer,
  ShipmentTagsContainer,
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
        shipmentCreate: {
          shipment: { id },
        },
      } = result;
      navigate(`/shipment/${encodeId(id)}`);
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
                    <NavBar>
                      <EntityIcon icon="SHIPMENT" color="SHIPMENT" />
                      <JumpToSection>
                        <SectionTabs link="shipmentSection" label="SHIPMENT" icon="SHIPMENT" />
                        <SectionTabs link="timelineSection" label="TIMELINE" icon="TIMELINE" />
                      </JumpToSection>
                      <Subscribe
                        to={[
                          ShipmentItemsContainer,
                          ShipmentInfoContainer,
                          ShipmentTagsContainer,
                          FormContainer,
                        ]}
                      >
                        {(shipmentItemState, shipmentInfoState, shipmentTagsState, form) =>
                          (isNew ||
                            shipmentItemState.isDirty() ||
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
                                      ...shipmentItemState.state,
                                      ...shipmentInfoState.state,
                                      ...shipmentTagsState.state,
                                    },
                                    saveShipment,
                                    () => {
                                      shipmentItemState.onSuccess();
                                      shipmentInfoState.onSuccess();
                                      shipmentTagsState.onSuccess();
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
                      to={[ShipmentItemsContainer, ShipmentInfoContainer, ShipmentTagsContainer]}
                    >
                      {(shipmentItemState, shipmentInfoState, shipmentTagsState) => (
                        <Query
                          query={query}
                          variables={{ id: decodeId(shipmentId) }}
                          fetchPolicy="network-only"
                          onCompleted={result => {
                            const {
                              shipment: { batches, tags, ...info },
                            } = result;
                            shipmentItemState.initDetailValues(batches);
                            shipmentTagsState.initDetailValues(tags);
                            shipmentInfoState.initDetailValues(info);
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
