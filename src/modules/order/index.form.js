// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import Layout from 'components/Layout';
import { QueryForm } from 'components/common';
import { UIConsumer } from 'modules/ui';
import { FormContainer } from 'modules/form';
import { SaveButton, CancelButton, ExportButton } from 'components/Buttons';
import NavBar, { EntityIcon, SlideViewNavBar, LogsButton } from 'components/NavBar';
import SlideView from 'components/SlideView';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { decodeId, encodeId } from 'utils/id';
import { OrderEventsList } from 'modules/history';
import OrderForm from './form';
import validator from './form/validator';
import {
  OrderItemsContainer,
  OrderInfoContainer,
  OrderTagsContainer,
  OrderFilesContainer,
} from './form/containers';
import { orderFormQuery } from './form/query';
import {
  createOrderMutation,
  prepareCreateOrderInput,
  updateOrderMutation,
  prepareUpdateOrderInput,
} from './form/mutation';

type OptionalProps = {
  path: string,
  isSlideView: boolean,
};

type Props = OptionalProps & {
  orderId?: string,
};

const defaultProps = {
  path: '',
  orderId: '',
  isSlideView: false,
};

class OrderFormModule extends React.PureComponent<Props> {
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

    const isNewOrClone = this.isNewOrClone();
    const input = isNewOrClone
      ? prepareCreateOrderInput(formData)
      : prepareUpdateOrderInput(formData);

    if (isNewOrClone) {
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
    if (this.isNewOrClone()) {
      const {
        orderCreate: {
          order: { id },
        },
      } = result;
      navigate(`/order/${encodeId(id)}`);
    }
  };

  render() {
    const { orderId, isSlideView } = this.props;
    const isNewOrClone = this.isNewOrClone();
    let mutationKey = {};
    if (orderId && !isNewOrClone) {
      mutationKey = { key: decodeId(orderId) };
    }

    return (
      <Provider>
        <UIConsumer>
          {uiState => (
            <Mutation
              mutation={isNewOrClone ? createOrderMutation : updateOrderMutation}
              onCompleted={this.onMutationCompleted}
              {...mutationKey}
            >
              {(saveOrder, { loading: isLoading, error: apiError }) => (
                <Layout
                  {...(isSlideView ? {} : uiState)}
                  navBar={
                    <NavBar>
                      <EntityIcon icon="ORDER" color="ORDER" />
                      <JumpToSection>
                        <SectionTabs
                          link="orderSection"
                          label={
                            <FormattedMessage id="modules.Orders.order" defaultMessage="ORDER" />
                          }
                          icon="ORDER"
                        />
                        <SectionTabs
                          link="itemsSection"
                          label={
                            <FormattedMessage id="modules.Orders.items" defaultMessage="ITEMS" />
                          }
                          icon="ORDER_ITEM"
                        />
                        <SectionTabs
                          link="documentsSection"
                          label={
                            <FormattedMessage
                              id="modules.Orders.documents"
                              defaultMessage="DOCUMENTS"
                            />
                          }
                          icon="DOCUMENT"
                        />
                        <SectionTabs
                          link="shipmentsSection"
                          label={
                            <FormattedMessage
                              id="modules.Orders.shipments"
                              defaultMessage="SHIPMENTS"
                            />
                          }
                          icon="SHIPMENT"
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
                            {(isNewOrClone ||
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
                                  isLoading={isLoading}
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
                            )}
                            {orderId &&
                              !isNewOrClone &&
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
                  {this.isNew() || !orderId ? (
                    <OrderForm isNew />
                  ) : (
                    <QueryForm
                      query={orderFormQuery}
                      entityId={orderId}
                      entityType="order"
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
                              isClone={this.isClone()}
                              onFormReady={() => {
                                const { orderItems, tags, files, ...info } = order;
                                if (this.isClone()) {
                                  const { issuedAt, poNo, ...cloneInfo } = info;
                                  orderInfoState.initDetailValues({
                                    ...cloneInfo,
                                    shipments: [],
                                    poNo: `[cloned] ${poNo}`,
                                  });
                                  orderItemState.initDetailValues(
                                    orderItems.map(item => ({ ...item, batches: [] }))
                                  );
                                } else {
                                  orderItemState.initDetailValues(orderItems);
                                  orderInfoState.initDetailValues(info);
                                }
                                orderFilesState.initDetailValues(files);
                                orderTagsState.initDetailValues(tags);
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
