// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { Query, Mutation } from 'react-apollo';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import Layout from 'components/Layout';
import Setting from 'modules/setting';
import { UIConsumer } from 'modules/ui';
import { FormContainer } from 'modules/form';
import { SaveButton, CancelButton } from 'components/Buttons';
import NavBar, { EntityIcon } from 'components/NavBar';
import LoadingIcon from 'components/LoadingIcon';
import SlideView from 'components/SlideView';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { decodeId, encodeId } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import logger from 'utils/logger';
import OrderForm from './form';
import validator from './form/validator';
import {
  OrderItemsContainer,
  OrderInfoContainer,
  OrderTagsContainer,
  OrderFilesContainer,
} from './form/containers';
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

  onSave = async (
    formData: Object,
    saveOrder: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { orderId } = this.props;

    const isNew = orderId === 'new';
    const input = isNew ? prepareCreateOrderInput(formData) : prepareUpdateOrderInput(formData);

    if (isNew) {
      const { data } = await saveOrder({ variables: { input } });
      const {
        orderCreate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
      }
    } else if (orderId) {
      const { data } = await saveOrder({ variables: { input, id: decodeId(orderId) } });
      const {
        orderUpdate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
      }
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
    logger.warn('result', result);
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
                    <NavBar setting={<Setting />}>
                      <EntityIcon icon="ORDER" color="ORDER" />
                      <JumpToSection>
                        <SectionTabs link="orderSection" label="ORDER" icon="ORDER" />
                        <SectionTabs link="itemsSection" label="ITEMS" icon="ORDER_ITEM" />
                        <SectionTabs link="documentsSection" label="DOCUMENTS" icon="DOCUMENT" />
                        <SectionTabs link="ordersSection" label="SHIPMENTS" icon="SHIPMENT" />
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

                      <Subscribe
                        to={[
                          OrderItemsContainer,
                          OrderInfoContainer,
                          OrderTagsContainer,
                          OrderFilesContainer,
                          FormContainer,
                        ]}
                      >
                        {(orderItemState, orderInfoState, orderTagsState, orderFilesState, form) =>
                          (isNew ||
                            orderItemState.isDirty() ||
                            orderInfoState.isDirty() ||
                            orderTagsState.isDirty() ||
                            orderFilesState.isDirty()) && (
                            <>
                              <CancelButton onClick={this.onCancel} />
                              <SaveButton
                                disabled={
                                  !form.isReady(
                                    {
                                      ...orderItemState.state,
                                      ...orderInfoState.state,
                                      ...orderTagsState.state,
                                      ...orderFilesState.state,
                                    },
                                    validator
                                  )
                                }
                                onClick={() =>
                                  this.onSave(
                                    {
                                      ...orderItemState.state,
                                      ...orderInfoState.state,
                                      ...orderTagsState.state,
                                      ...orderFilesState.state,
                                    },
                                    saveOrder,
                                    () => {
                                      orderItemState.onSuccess();
                                      orderInfoState.onSuccess();
                                      orderTagsState.onSuccess();
                                      orderFilesState.onSuccess();
                                      form.onReset();
                                    },
                                    form.onErrors
                                  )
                                }
                              />
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
                    <OrderForm
                      isNew
                      onChangeStatus={(formData, onSuccess) =>
                        this.onSave(formData, saveOrder, onSuccess)
                      }
                    />
                  ) : (
                    <Subscribe
                      to={[
                        OrderItemsContainer,
                        OrderInfoContainer,
                        OrderTagsContainer,
                        OrderFilesContainer,
                      ]}
                    >
                      {(orderItemState, orderInfoState, orderTagsState, orderFilesState) => (
                        <Query
                          query={query}
                          variables={{ id: decodeId(orderId) }}
                          fetchPolicy="network-only"
                          onCompleted={result => {
                            if (result.order) {
                              const {
                                order: { orderItems, tags, files, ...info },
                              } = result;
                              orderItemState.initDetailValues(orderItems);
                              orderTagsState.initDetailValues(tags);
                              orderInfoState.initDetailValues(info);
                              orderFilesState.initDetailValues(files);
                            } else {
                              navigate('/404');
                            }
                          }}
                        >
                          {({ loading, data, error }) => {
                            if (error) {
                              return error.message;
                            }

                            if (loading) return <LoadingIcon />;
                            return (
                              <OrderForm
                                order={getByPathWithDefault({}, 'order', data)}
                                onChangeStatus={(formData, onSuccess) =>
                                  this.onSave(formData, saveOrder, onSuccess)
                                }
                              />
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

export default OrderFormModule;
