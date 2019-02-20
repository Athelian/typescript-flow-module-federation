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
import { FormContainer, resetFormState } from 'modules/form';
import { SaveButton, CancelButton, ResetButton, ExportButton } from 'components/Buttons';
import NavBar, { EntityIcon, SlideViewNavBar, LogsButton } from 'components/NavBar';
import SlideView from 'components/SlideView';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import NoPermission from 'components/NoPermission';
import { ORDER_GET } from 'modules/permission/constants/order';
import { PermissionConsumer } from 'modules/permission';
import { decodeId, encodeId } from 'utils/id';
import { OrderEventsList } from 'modules/history';
import { orderExportQuery } from './query';
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
  redirectAfterSuccess: boolean,
  onSuccessCallback: ?Function,
  onCancel?: Function,
};

type Props = OptionalProps & {
  orderId?: string,
};

const defaultProps = {
  path: '',
  orderId: '',
  isSlideView: false,
  onSuccessCallback: null,
  redirectAfterSuccess: true,
};

type OrderFormState = {
  orderInfoState: Object,
  orderItemState: Object,
  orderTagsState: Object,
  orderFilesState: Object,
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

  onCancel = () => navigate('/order');

  onReset = ({
    orderInfoState,
    orderItemState,
    orderTagsState,
    orderFilesState,
    form,
  }: OrderFormState & { form: Object }) => {
    resetFormState(orderInfoState);
    resetFormState(orderItemState, 'orderItems');
    resetFormState(orderTagsState, 'tags');
    resetFormState(orderFilesState, 'files');
    form.onReset();
  };

  onSave = async (
    formData: Object,
    saveOrder: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { orderId, onSuccessCallback } = this.props;

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
        if (onSuccessCallback) {
          onSuccessCallback(data);
        }
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
        if (onSuccessCallback) {
          onSuccessCallback(data);
        }
      }
    }
  };

  onFormReady = ({
    orderItemState,
    orderInfoState,
    orderTagsState,
    orderFilesState,
  }: {
    orderItemState: Object,
    orderInfoState: Object,
    orderTagsState: Object,
    orderFilesState: Object,
  }) => (order: Object) => {
    const { orderItems, tags, files, ...info } = order;
    const { currency } = info;
    orderInfoState.initDetailValues({ currency });
    if (this.isClone()) {
      const { issuedAt, poNo, ...cloneInfo } = info;
      orderInfoState.initDetailValues({
        ...cloneInfo,
        shipments: [],
        poNo: `[cloned] ${poNo}`,
      });
      orderItemState.initDetailValues(orderItems.map(item => ({ ...item, batches: [] })));
      orderFilesState.initDetailValues([]);
    } else {
      orderItemState.initDetailValues(orderItems);
      orderInfoState.initDetailValues(info);
      orderFilesState.initDetailValues(files);
    }
    orderTagsState.initDetailValues(tags);
  };

  onMutationCompleted = ({
    orderItemState,
    orderInfoState,
    orderTagsState,
    orderFilesState,
  }: {
    orderItemState: Object,
    orderInfoState: Object,
    orderTagsState: Object,
    orderFilesState: Object,
  }) => (result: Object) => {
    const { redirectAfterSuccess } = this.props;
    if (this.isNewOrClone()) {
      const { orderCreate } = result;
      if (redirectAfterSuccess) {
        navigate(`/order/${encodeId(orderCreate.id)}`);
      }
    } else {
      const { orderUpdate } = result;
      this.onFormReady({
        orderItemState,
        orderInfoState,
        orderTagsState,
        orderFilesState,
      })(orderUpdate);
    }
  };

  render() {
    const { orderId, isSlideView, onCancel } = this.props;
    const isNewOrClone = this.isNewOrClone();
    let mutationKey = {};
    if (orderId && !isNewOrClone) {
      mutationKey = { key: decodeId(orderId) };
    }
    const updateOrder = updateOrderMutation;
    const CurrentNavBar = isSlideView ? SlideViewNavBar : NavBar;
    return (
      <PermissionConsumer>
        {hasPermission =>
          hasPermission(ORDER_GET) ? (
            <Provider>
              <UIConsumer>
                {uiState => (
                  <Subscribe
                    to={[
                      OrderItemsContainer,
                      OrderInfoContainer,
                      OrderTagsContainer,
                      OrderFilesContainer,
                      FormContainer,
                    ]}
                  >
                    {(orderItemState, orderInfoState, orderTagsState, orderFilesState, form) => (
                      <Mutation
                        mutation={isNewOrClone ? createOrderMutation : updateOrder}
                        onCompleted={this.onMutationCompleted({
                          orderItemState,
                          orderInfoState,
                          orderTagsState,
                          orderFilesState,
                        })}
                        {...mutationKey}
                      >
                        {(saveOrder, { loading: isLoading, error: apiError }) => (
                          <Layout
                            {...(isSlideView ? {} : uiState)}
                            navBar={
                              <CurrentNavBar>
                                <EntityIcon icon="ORDER" color="ORDER" />
                                <JumpToSection>
                                  <SectionTabs
                                    link="order_orderSection"
                                    label={
                                      <FormattedMessage
                                        id="modules.Orders.order"
                                        defaultMessage="ORDER"
                                      />
                                    }
                                    icon="ORDER"
                                  />
                                  <SectionTabs
                                    link="order_itemsSection"
                                    label={
                                      <FormattedMessage
                                        id="modules.Orders.items"
                                        defaultMessage="ITEMS"
                                      />
                                    }
                                    icon="ORDER_ITEM"
                                  />
                                  <SectionTabs
                                    link="order_documentsSection"
                                    label={
                                      <FormattedMessage
                                        id="modules.Orders.documents"
                                        defaultMessage="DOCUMENTS"
                                      />
                                    }
                                    icon="DOCUMENT"
                                  />
                                  <SectionTabs
                                    link="order_shipmentsSection"
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
                                            {orderId && opened ? (
                                              <OrderEventsList
                                                id={decodeId(orderId)}
                                                perPage={10}
                                              />
                                            ) : null}
                                          </Layout>
                                        </SlideView>
                                      </>
                                    )
                                  }
                                </BooleanValue>

                                <>
                                  {(isNewOrClone ||
                                    orderItemState.isDirty() ||
                                    orderInfoState.isDirty() ||
                                    orderTagsState.isDirty() ||
                                    orderFilesState.isDirty()) && (
                                    <>
                                      {this.isNewOrClone() ? (
                                        <CancelButton
                                          onClick={() => (onCancel ? onCancel() : this.onCancel())}
                                        />
                                      ) : (
                                        <ResetButton
                                          onClick={() =>
                                            this.onReset({
                                              orderItemState,
                                              orderInfoState,
                                              orderTagsState,
                                              orderFilesState,
                                              form,
                                            })
                                          }
                                        />
                                      )}

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
                                      <ExportButton
                                        type="Order"
                                        exportQuery={orderExportQuery}
                                        variables={{ id: decodeId(orderId) }}
                                      />
                                    )}
                                </>
                              </CurrentNavBar>
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
                                  <OrderForm
                                    order={order}
                                    isClone={this.isClone()}
                                    onFormReady={() => {
                                      this.onFormReady({
                                        orderItemState,
                                        orderInfoState,
                                        orderTagsState,
                                        orderFilesState,
                                      })(order);
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
            </Provider>
          ) : (
            <NoPermission />
          )
        }
      </PermissionConsumer>
    );
  }
}

export default OrderFormModule;
