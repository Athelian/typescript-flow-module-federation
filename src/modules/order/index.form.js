// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { Mutation } from 'react-apollo';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import { showToastError } from 'utils/errors';
import { Content, SlideViewLayout } from 'components/Layout';
import { getByPath } from 'utils/fp';
import { FormContainer } from 'modules/form';
import { UserConsumer } from 'modules/user';
import Timeline from 'modules/timeline/components/Timeline';
import QueryFormV2 from 'components/common/QueryFormV2';
import { SaveButton, CancelButton, ResetButton, ExportButton } from 'components/Buttons';
import { NavBar, EntityIcon, SlideViewNavBar, LogsButton } from 'components/NavBar';
import SlideView from 'components/SlideView';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { decodeId, encodeId, uuid } from 'utils/id';
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
  orderId: string,
  isSlideView: boolean,
  redirectAfterSuccess: boolean,
  onSuccessCallback: ?Function,
  onCancel?: Function,
  initDataForSlideView: Object,
};

type Props = OptionalProps & {
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
      if (!data) return;

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
      if (!data) return;

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
    const {
      orderItems = [],
      hasCalledItemsApiYet = false,
      hasCalledTasksApiYet = false,
      tags = [],
      files = [],
      todo,
      ...info
    } = order;
    orderInfoState.initDetailValues(info);
    orderItemState.initDetailValues(orderItems, hasCalledItemsApiYet || orderItems.length > 0);
    orderFilesState.initDetailValues(files);
    if (todo) {
      orderTasksState.initDetailValues(todo, hasCalledTasksApiYet || todo.tasks.length > 0);
    }
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
    const {
      orderItems,
      hasCalledItemsApiYet = false,
      hasCalledTasksApiYet = false,
      tags,
      files,
      todo,
      issuedAt,
      poNo,
      ...info
    } = order;
    orderInfoState.initDetailValues({
      ...info,
      shipments: [],
      poNo: `[cloned] ${poNo}`,
    });
    if (hasCalledItemsApiYet) {
      orderItemState.initDetailValues(orderItems.map(item => ({ ...item, batches: [] })));
    }
    orderFilesState.initDetailValues([]);
    orderTasksState.initDetailValues({ tasks: [] }, hasCalledTasksApiYet);
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
    const CurrentLayout = isSlideView ? SlideViewLayout : React.Fragment;

    return (
      <Provider inject={[formContainer]}>
        <Mutation
          mutation={isNewOrClone ? createOrderMutation : updateOrderMutation}
          onCompleted={this.onMutationCompleted}
          {...mutationKey}
        >
          {(saveOrder, { loading: isLoading, error: apiError }) => (
            <CurrentLayout>
              <CurrentNavBar>
                <EntityIcon icon="ORDER" color="ORDER" />
                <JumpToSection>
                  <SectionTabs
                    link="order_orderSection"
                    label={<FormattedMessage id="modules.Orders.order" defaultMessage="ORDER" />}
                    icon="ORDER"
                  />
                  <SectionTabs
                    link="order_itemsSection"
                    label={<FormattedMessage id="modules.Orders.items" defaultMessage="ITEMS" />}
                    icon="ORDER_ITEM"
                  />
                  <SectionTabs
                    link="order_documentsSection"
                    label={
                      <FormattedMessage id="modules.Orders.documents" defaultMessage="DOCUMENTS" />
                    }
                    icon="DOCUMENT"
                  />
                  <SectionTabs
                    link="order_taskSection"
                    label={<FormattedMessage id="modules.Orders.task" defaultMessage="TASK" />}
                    icon="TASK"
                  />
                  <SectionTabs
                    link="order_shipmentsSection"
                    label={
                      <FormattedMessage id="modules.Orders.shipments" defaultMessage="SHIPMENTS" />
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
                          <SlideViewLayout>
                            {orderId && opened && (
                              <>
                                <SlideViewNavBar>
                                  <EntityIcon icon="LOGS" color="LOGS" />
                                </SlideViewNavBar>

                                <Content>
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
                                </Content>
                              </>
                            )}
                          </SlideViewLayout>
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
                          <CancelButton onClick={() => (onCancel ? onCancel() : this.onCancel())} />
                        ) : (
                          <>
                            {isDirty && (
                              <ResetButton
                                onClick={() => {
                                  this.initAllValues(
                                    {
                                      orderItemState,
                                      orderInfoState,
                                      orderTagsState,
                                      orderFilesState,
                                      orderTasksState,
                                    },
                                    {
                                      ...orderItemState.originalValues,
                                      ...orderInfoState.originalValues,
                                      ...orderTagsState.originalValues,
                                      ...orderFilesState.originalValues,
                                      ...orderTasksState.originalValues,
                                    }
                                  );
                                  form.onReset();
                                }}
                              />
                            )}
                          </>
                        )}

                        {(isNewOrClone || isDirty) && (
                          <SaveButton
                            data-testid="btnSaveOrder"
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
                                    {
                                      ...updateOrder,
                                      hasCalledItemsApiYet: true,
                                      hasCalledTasksApiYet: true,
                                    }
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
              <Content>
                {apiError && <p>Error: Please try again.</p>}
                {this.isNew() || !orderId ? (
                  <UserConsumer>
                    {({ user }) => {
                      const { group } = user;
                      const { types = [] } = group;
                      const isImporter = types.includes('Importer');
                      return (
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
                                  id: uuid(),
                                  inCharges: [],
                                  currency: 'USD',
                                  customFields: {
                                    mask: null,
                                    fieldValues: [],
                                  },
                                  tags: [],
                                  importer: isImporter ? group : {},
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
                      );
                    }}
                  </UserConsumer>
                ) : (
                  <QueryFormV2
                    query={orderFormQuery}
                    entityId={orderId}
                    entityType="order"
                    render={(order, { isLoading: loading, isOwner }) => (
                      <>
                        <OrderForm
                          order={order}
                          loading={loading}
                          isOwner={isOwner}
                          isClone={this.isClone()}
                        />
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
              </Content>
            </CurrentLayout>
          )}
        </Mutation>
      </Provider>
    );
  }
}

export default injectIntl(OrderFormModule);
