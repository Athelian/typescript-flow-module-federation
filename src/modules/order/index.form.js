// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import Layout from 'components/Layout';
import QueryDetail from 'components/common/QueryDetail';
import { UIConsumer } from 'modules/ui';
import { FormContainer } from 'modules/form';
import { SaveButton, CancelButton, ExportButton } from 'components/Buttons';
import NavBar, { EntityIcon, SlideViewNavBar, LogsButton } from 'components/NavBar';
import LoadingIcon from 'components/LoadingIcon';
import SlideView from 'components/SlideView';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { decodeId, encodeId } from 'utils/id';
import logger from 'utils/logger';
import OrderEventsList from 'modules/history';
import OrderForm from './form';
import validator from './form/validator';
import {
  OrderItemsContainer,
  OrderInfoContainer,
  OrderTagsContainer,
  OrderFilesContainer,
} from './form/containers';
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
    logger.warn('mutation result', result);
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
                        <SectionTabs
                          link="orderSection"
                          label={
                            <FormattedMessage id="modules.order.order" defaultMessage="ORDER" />
                          }
                          icon="ORDER"
                        />
                        <SectionTabs
                          link="itemsSection"
                          label={
                            <FormattedMessage id="modules.order.items" defaultMessage="ITEMS" />
                          }
                          icon="ORDER_ITEM"
                        />
                        <SectionTabs
                          link="documentsSection"
                          label={
                            <FormattedMessage
                              id="modules.order.documents"
                              defaultMessage="DOCUMENTS"
                            />
                          }
                          icon="DOCUMENT"
                        />
                        <SectionTabs
                          link="shipmentsSection"
                          label={
                            <FormattedMessage
                              id="modules.order.shipments"
                              defaultMessage="SHIPMENTS"
                            />
                          }
                          icon="SHIPMENT"
                        />
                      </JumpToSection>
                      <BooleanValue>
                        {({ value: opened, set: slideToggle }) =>
                          !isNew && (
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
                                  {orderId ? (
                                    <OrderEventsList id={decodeId(orderId)} perPage={10} />
                                  ) : null}
                                </Layout>
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
                        {(
                          orderItemState,
                          orderInfoState,
                          orderTagsState,
                          orderFilesState,
                          form
                        ) => (
                          <>
                            {(isNew ||
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
                                {isLoading && <LoadingIcon />}
                              </>
                            )}
                            {orderId &&
                              !isNew &&
                              !orderItemState.isDirty() &&
                              !orderInfoState.isDirty() &&
                              !orderTagsState.isDirty() &&
                              !orderFilesState.isDirty() && (
                                <ExportButton type="PO" format="xlsx" id={decodeId(orderId)} />
                              )}
                          </>
                        )}
                      </Subscribe>
                    </NavBar>
                  }
                >
                  {apiError && <p>Error: Please try again.</p>}
                  {isNew || !orderId ? (
                    <OrderForm isNew />
                  ) : (
                    <QueryDetail
                      query={query}
                      detailId={orderId}
                      detailType="order"
                      render={order => (
                        <Subscribe
                          to={[
                            OrderItemsContainer,
                            OrderInfoContainer,
                            OrderTagsContainer,
                            OrderFilesContainer,
                          ]}
                        >
                          {(orderItemState, orderInfoState, orderTagsState, orderFilesState) => (
                            <OrderForm
                              order={order}
                              onChangeStatus={(formData, onSuccess) =>
                                this.onSave(
                                  {
                                    ...orderItemState.state,
                                    ...orderInfoState.state,
                                    ...orderTagsState.state,
                                    ...orderFilesState.state,
                                    ...formData,
                                  },
                                  saveOrder,
                                  onSuccess
                                )
                              }
                              onDetailReady={() => {
                                const { orderItems, tags, files, ...info } = order;
                                orderItemState.initDetailValues(orderItems);
                                orderTagsState.initDetailValues(tags);
                                orderInfoState.initDetailValues(info);
                                orderFilesState.initDetailValues(files);
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

export default OrderFormModule;
