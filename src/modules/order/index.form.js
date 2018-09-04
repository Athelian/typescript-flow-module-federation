// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { Query, Mutation } from 'react-apollo';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import { FormContainer } from 'modules/form';
import { SaveButton, CancelButton } from 'components/NavButtons';
import NavBar, { EntityIcon } from 'components/NavBar';
import LoadingIcon from 'components/LoadingIcon';
import SlideView from 'components/SlideView';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { decodeId, encodeId } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import OrderForm from './form';
import OrderFormContainer from './form/container';
import LogsButton from './form/components/LogsButton';
import query from './form/query';
import {
  createOrderMutation,
  prepareCreateOrderInput,
  updateOrderMutation,
  prepareUpdateOrderInput,
} from './form/mutation';

type Props = {
  orderId?: string,
};

const defaultProps = {
  orderId: '',
};

class OrderFormModule extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  onCancel = () => {
    navigate(`/order`);
  };

  onSave = (formData: Object, saveOrder: Function) => {
    const { orderId } = this.props;

    const isNew = orderId === 'new';
    const input = isNew ? prepareCreateOrderInput(formData) : prepareUpdateOrderInput(formData);

    if (isNew) {
      saveOrder({ variables: { input } });
    } else if (orderId) {
      saveOrder({ variables: { input, id: decodeId(orderId) } });
    }
  };

  onMutationCompleted = (result: Object) => {
    const { orderId } = this.props;
    const isNew = orderId === 'new';
    if (isNew) {
      const {
        orderCreate: {
          order: { id },
        },
      } = result;
      navigate(`/order/${encodeId(id)}`);
    }
  };

  render() {
    const { orderId } = this.props;
    const isNew = orderId === 'new';
    let mutationKey = {};
    if (orderId && !isNew) {
      mutationKey = { key: decodeId(orderId) };
    }

    return (
      <Provider>
        <UIConsumer>
          {uiState => (
            <Mutation
              mutation={isNew ? createOrderMutation : updateOrderMutation}
              onCompleted={this.onMutationCompleted}
              {...mutationKey}
            >
              {(saveOrder, { loading: isLoading, error: apiError }) => (
                <Layout
                  {...uiState}
                  navBar={
                    <NavBar>
                      <EntityIcon icon="ORDER" color="ORDER" />
                      <JumpToSection>
                        <SectionTabs link="orderSection" label="ORDER" icon="ORDER" />
                        <SectionTabs link="itemsSection" label="ITEMS" icon="ORDER_ITEM" />
                        <SectionTabs link="documentsSection" label="DOCUMENTS" icon="DOCUMENT" />
                        <SectionTabs link="shipmentsSection" label="SHIPMENTS" icon="SHIPMENT" />
                      </JumpToSection>
                      <BooleanValue>
                        {({ value: opened, toggle }) =>
                          !isNew && (
                            <>
                              <LogsButton onClick={toggle} />
                              <SlideView
                                isOpen={opened}
                                onRequestClose={toggle}
                                options={{ width: '1030px' }}
                              >
                                <div style={{ padding: '50px', textAlign: 'center' }}>
                                  <h1>Logs</h1>
                                </div>
                              </SlideView>
                            </>
                          )
                        }
                      </BooleanValue>

                      <Subscribe to={[OrderFormContainer, FormContainer]}>
                        {(formState, form) =>
                          (isNew || formState.isDirty(formState.state)) && (
                            <>
                              <CancelButton disabled={false} onClick={this.onCancel}>
                                Cancel
                              </CancelButton>
                              <SaveButton
                                disabled={!form.isReady()}
                                onClick={() => this.onSave(formState.state, saveOrder)}
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
                  {isNew || !orderId ? (
                    <OrderForm order={{}} />
                  ) : (
                    <Subscribe to={[OrderFormContainer]}>
                      {({ initDetailValues }) => (
                        <Query
                          query={query}
                          variables={{ id: decodeId(orderId) }}
                          fetchPolicy="network-only"
                          onCompleted={detail => initDetailValues(detail.order)}
                        >
                          {({ loading, data, error }) => {
                            if (error) {
                              return error.message;
                            }

                            if (loading) return <LoadingIcon />;
                            return <OrderForm order={getByPathWithDefault({}, 'order', data)} />;
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

export default OrderFormModule;
