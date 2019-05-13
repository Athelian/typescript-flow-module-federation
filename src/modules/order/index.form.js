// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { Mutation } from 'react-apollo';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import { showToastError } from 'utils/errors';
import Layout from 'components/Layout';
import { QueryForm } from 'components/common';
import { UIConsumer } from 'modules/ui';
import { getByPath } from 'utils/fp';
import { FormContainer, resetFormState } from 'modules/form';
import Timeline from 'modules/timeline/components/Timeline';
import { SaveButton, CancelButton, ResetButton, ExportButton } from 'components/Buttons';
import NavBar, { EntityIcon, SlideViewNavBar, LogsButton } from 'components/NavBar';
import SlideView from 'components/SlideView';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { decodeId, encodeId } from 'utils/id';
import { removeTypename } from 'utils/data';
import { orderExportQuery, orderTimelineQuery } from './query';
import OrderForm from './form';
import validator from './form/validator';
import {
  OrderItemsContainer,
  OrderInfoContainer,
  OrderTagsContainer,
  OrderFilesContainer,
  OrderTasksContainer,
} from './form/containers';
import { orderFormQuery } from './form/query';
import { createOrderMutation, updateOrderMutation, prepareParsedOrderInput } from './form/mutation';

type OptionalProps = {
  path: string,
  isSlideView: boolean,
  redirectAfterSuccess: boolean,
  onSuccessCallback: ?Function,
  onCancel?: Function,
  initDataForSlideView: Object,
};

type Props = OptionalProps & {
  orderId?: string,
  intl: IntlShape,
};

const defaultProps = {
  path: '',
  orderId: '',
  isSlideView: false,
  onSuccessCallback: null,
  redirectAfterSuccess: true,
  initDataForSlideView: {},
};

type CreateOrderResponse = {|
  orderCreate: {
    violations?: Array<Object>,
    id?: string,
  },
|};

type UpdateOrderResponse = {|
  orderUpdate: {
    violations?: Array<Object>,
    id?: string,
  },
|};

type OrderFormState = {
  orderInfoState: Object,
  orderItemState: Object,
  orderTagsState: Object,
  orderFilesState: Object,
  orderTasksState: Object,
};

const formContainer = new FormContainer();
class OrderFormModule extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  componentWillUnmount() {
    formContainer.onReset();
  }

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
    orderTasksState,
    form,
  }: OrderFormState & { form: Object }) => {
    resetFormState(orderInfoState);
    resetFormState(orderItemState, 'orderItems');
    resetFormState(orderTagsState, 'tags');
    resetFormState(orderFilesState, 'files');
    resetFormState(orderTasksState, 'todo');
    form.onReset();
  };

  onSave = async (
    originalValues: Object,
    formData: Object,
    saveOrder: Function,
    onSuccess: Object => void,
    onErrors: Function = () => {}
  ) => {
    const { orderId, onSuccessCallback } = this.props;

    const isNewOrClone = this.isNewOrClone();
    const input = prepareParsedOrderInput(
      isNewOrClone ? null : removeTypename(originalValues),
      removeTypename(formData)
    );

    if (isNewOrClone) {
      const { data } = await saveOrder({ variables: { input } });
      const {
        orderCreate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess(getByPath('orderCreate', data));
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
        onSuccess(getByPath('orderUpdate', data));
        if (onSuccessCallback) {
          onSuccessCallback(data);
        }
      }
    }
  };

  initAllValues = (
    {
      orderItemState,
      orderInfoState,
      orderTagsState,
      orderFilesState,
      orderTasksState,
    }: OrderFormState,
    order: Object
  ) => {
    const { orderItems = [], tags = [], files = [], todo = { tasks: [] }, ...info } = order;
    orderInfoState.initDetailValues(info);
    orderItemState.initDetailValues(orderItems);
    orderFilesState.initDetailValues(files);
    orderTasksState.initDetailValues(todo);
    orderTagsState.initDetailValues(tags);
    return null;
  };

  initAllValuesForClone = (
    {
      orderItemState,
      orderInfoState,
      orderTagsState,
      orderFilesState,
      orderTasksState,
    }: OrderFormState,
    order: Object
  ) => {
    const { orderItems, tags, files, todo, issuedAt, poNo, ...info } = order;
    orderInfoState.initDetailValues({
      ...info,
      shipments: [],
      poNo: `[cloned] ${poNo}`,
    });
    orderItemState.initDetailValues(orderItems.map(item => ({ ...item, batches: [] })));
    orderFilesState.initDetailValues([]);
    orderTasksState.initDetailValues({ tasks: [] });
    orderTagsState.initDetailValues(tags);
    return null;
  };

  onFormReady = (
    {
      orderItemState,
      orderInfoState,
      orderTagsState,
      orderFilesState,
      orderTasksState,
    }: OrderFormState,
    order: Object
  ) => {
    const hasInitialStateYet = orderInfoState.state.id || Object.keys(order).length === 0;
    if (hasInitialStateYet) return null;

    if (this.isClone()) {
      this.initAllValuesForClone(
        {
          orderItemState,
          orderInfoState,
          orderTagsState,
          orderFilesState,
          orderTasksState,
        },
        order
      );
    } else {
      this.initAllValues(
        {
          orderItemState,
          orderInfoState,
          orderTagsState,
          orderFilesState,
          orderTasksState,
        },
        order
      );
    }
    return null;
  };

  onMutationCompleted = (result: CreateOrderResponse | UpdateOrderResponse) => {
    const { redirectAfterSuccess, intl } = this.props;

    if (showToastError({ intl, result, entity: 'order' })) {
      return;
    }

    if (result.orderCreate) {
      const { orderCreate } = result;

      if (!orderCreate.violations) {
        if (orderCreate.id && redirectAfterSuccess) {
          navigate(`/order/${encodeId(orderCreate.id)}`);
        }
      }
    }
  };

  render() {
    const { orderId, isSlideView, onCancel, initDataForSlideView } = this.props;
    const isNewOrClone = this.isNewOrClone();
    let mutationKey = {};
    if (orderId && !isNewOrClone) {
      mutationKey = { key: decodeId(orderId) };
    }
    const CurrentNavBar = isSlideView ? SlideViewNavBar : NavBar;

    return (
      <UIConsumer>
        {uiState => (
          <Provider inject={[formContainer]}>
            <Mutation
              mutation={isNewOrClone ? createOrderMutation : updateOrderMutation}
              onCompleted={this.onMutationCompleted}
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
                            <FormattedMessage id="modules.Orders.order" defaultMessage="ORDER" />
                          }
                          icon="ORDER"
                        />
                        <SectionTabs
                          link="order_itemsSection"
                          label={
                            <FormattedMessage id="modules.Orders.items" defaultMessage="ITEMS" />
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
                          link="order_taskSection"
                          label={
                            <FormattedMessage id="modules.Orders.task" defaultMessage="TASK" />
                          }
                          icon="TASK"
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
                        <SectionTabs
                          link="order_containersSection"
                          label={
                            <FormattedMessage
                              id="modules.Orders.containers"
                              defaultMessage="CONTAINERS"
                            />
                          }
                          icon="CONTAINER"
                        />
                      </JumpToSection>
                      <BooleanValue>
                        {({ value: opened, set: slideToggle }) =>
                          !isNewOrClone && (
                            <>
                              <LogsButton onClick={() => slideToggle(true)} />
                              <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                                <Layout
                                  navBar={
                                    <SlideViewNavBar>
                                      <EntityIcon icon="LOGS" color="LOGS" />
                                    </SlideViewNavBar>
                                  }
                                >
                                  {orderId && opened ? (
                                    <Timeline
                                      query={orderTimelineQuery}
                                      queryField="order"
                                      variables={{
                                        id: decodeId(orderId),
                                      }}
                                      entity={{
                                        orderId: decodeId(orderId),
                                      }}
                                    />
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
                          OrderTasksContainer,
                          FormContainer,
                        ]}
                      >
                        {(
                          orderItemState,
                          orderInfoState,
                          orderTagsState,
                          orderFilesState,
                          orderTasksState,
                          form
                        ) => {
                          const isDirty =
                            orderItemState.isDirty() ||
                            orderInfoState.isDirty() ||
                            orderTagsState.isDirty() ||
                            orderFilesState.isDirty() ||
                            orderTasksState.isDirty();

                          return (
                            <>
                              {isNewOrClone ? (
                                <CancelButton
                                  onClick={() => (onCancel ? onCancel() : this.onCancel())}
                                />
                              ) : (
                                <>
                                  {isDirty && (
                                    <ResetButton
                                      onClick={() =>
                                        this.onReset({
                                          orderItemState,
                                          orderInfoState,
                                          orderTagsState,
                                          orderFilesState,
                                          orderTasksState,
                                          form,
                                        })
                                      }
                                    />
                                  )}
                                </>
                              )}

                              {(isNewOrClone || isDirty) && (
                                <SaveButton
                                  disabled={
                                    !form.isReady(
                                      {
                                        ...orderItemState.state,
                                        ...orderInfoState.state,
                                        ...orderTagsState.state,
                                        ...orderFilesState.state,
                                        ...orderTasksState.state,
                                      },
                                      validator
                                    )
                                  }
                                  isLoading={isLoading}
                                  onClick={() =>
                                    this.onSave(
                                      {
                                        ...orderItemState.originalValues,
                                        ...orderInfoState.originalValues,
                                        ...orderTagsState.originalValues,
                                        ...orderFilesState.originalValues,
                                        ...orderTasksState.originalValues,
                                      },
                                      {
                                        ...orderItemState.state,
                                        ...orderInfoState.state,
                                        ...orderTagsState.state,
                                        ...orderFilesState.state,
                                        ...orderTasksState.state,
                                      },
                                      saveOrder,
                                      updateOrder => {
                                        this.initAllValues(
                                          {
                                            orderItemState,
                                            orderInfoState,
                                            orderTagsState,
                                            orderFilesState,
                                            orderTasksState,
                                          },
                                          updateOrder
                                        );
                                        form.onReset();
                                      },
                                      form.onErrors
                                    )
                                  }
                                />
                              )}
                              {orderId && !isDirty && !isNewOrClone && (
                                <ExportButton
                                  type="Order"
                                  exportQuery={orderExportQuery}
                                  variables={{ id: decodeId(orderId) }}
                                />
                              )}
                            </>
                          );
                        }}
                      </Subscribe>
                    </CurrentNavBar>
                  }
                >
                  {apiError && <p>Error: Please try again.</p>}
                  {this.isNew() || !orderId ? (
                    <>
                      <OrderForm isNew />
                      <Subscribe
                        to={[
                          OrderItemsContainer,
                          OrderInfoContainer,
                          OrderTagsContainer,
                          OrderFilesContainer,
                          OrderTasksContainer,
                        ]}
                      >
                        {(
                          orderItemState,
                          orderInfoState,
                          orderTagsState,
                          orderFilesState,
                          orderTasksState
                        ) =>
                          this.onFormReady(
                            {
                              orderItemState,
                              orderInfoState,
                              orderTagsState,
                              orderFilesState,
                              orderTasksState,
                            },
                            {
                              id: Date.now(),
                              inCharges: [],
                              currency: 'USD',
                              customFields: {
                                fieldValues: [],
                                fieldDefinitions: [],
                              },
                              tags: [],
                              todo: {
                                tasks: [],
                              },
                              files: [],
                              orderItems: [],
                              shipments: [],
                              containers: [],
                              ...initDataForSlideView,
                            }
                          )
                        }
                      </Subscribe>
                    </>
                  ) : (
                    <QueryForm
                      query={orderFormQuery}
                      entityId={orderId}
                      entityType="order"
                      render={order => (
                        <>
                          <OrderForm order={order} isClone={this.isClone()} />
                          <Subscribe
                            to={[
                              OrderItemsContainer,
                              OrderInfoContainer,
                              OrderTagsContainer,
                              OrderFilesContainer,
                              OrderTasksContainer,
                            ]}
                          >
                            {(
                              orderItemState,
                              orderInfoState,
                              orderTagsState,
                              orderFilesState,
                              orderTasksState
                            ) =>
                              this.onFormReady(
                                {
                                  orderItemState,
                                  orderInfoState,
                                  orderTagsState,
                                  orderFilesState,
                                  orderTasksState,
                                },
                                order
                              )
                            }
                          </Subscribe>
                        </>
                      )}
                    />
                  )}
                </Layout>
              )}
            </Mutation>
          </Provider>
        )}
      </UIConsumer>
    );
  }
}

export default injectIntl(OrderFormModule);
