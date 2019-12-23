// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { Mutation } from 'react-apollo';
import { showToastError } from 'utils/errors';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { getByPath } from 'utils/fp';
import { FormContainer } from 'modules/form';
import { CancelButton } from 'components/Buttons';
import SaveFormButton from 'components/SaveFormButton';
import { EntityIcon } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { uuid } from 'utils/id';
import { removeTypename } from 'utils/data';
import { initValues as taskInitValues } from 'modules/order/form/containers/tasks';
import OrderForm from 'modules/order/form';
import validator from 'modules/order/form/validator';
import {
  OrderItemsContainer,
  OrderInfoContainer,
  OrderTagsContainer,
  OrderFilesContainer,
  OrderTasksContainer,
} from 'modules/order/form/containers';
import { createOrderMutation, prepareParsedOrderInput } from 'modules/order/form/mutation';

type Props = {|
  onSuccessCallback: Function,
  onCancel: Function,
  initDataForSlideView: Object,
  originalDataForSlideView: Object,
  intl: IntlShape,
|};

type CreateOrderResponse = {|
  orderCreate: {
    violations?: Array<Object>,
    id?: string,
  },
|};

const orderItemState = new OrderItemsContainer();
const orderInfoState = new OrderInfoContainer();
const orderTagsState = new OrderTagsContainer();
const orderFilesState = new OrderFilesContainer();
const orderTasksState = new OrderTasksContainer();
const form = new FormContainer();
class NewOrderForm extends React.PureComponent<Props> {
  isMountedOnDOM = false;

  componentDidMount() {
    const { initDataForSlideView } = this.props;
    this.isMountedOnDOM = true;
    const order = {
      id: uuid(),
      inCharges: [],
      currency: 'USD',
      customFields: {
        mask: null,
        fieldValues: [],
      },
      tags: [],
      importer: {},
      todo: {
        tasks: [],
      },
      files: [],
      orderItems: [],
      shipments: [],
      containers: [],
      ...initDataForSlideView,
    };
    this.initAllValues(order);
  }

  componentWillUnmount() {
    this.isMountedOnDOM = false;
    form.onReset();
  }

  onSave = async (
    originalValues: Object,
    formData: Object,
    saveOrder: Function,
    onSuccess: Object => void,
    onErrors: Function = () => {}
  ) => {
    const { onSuccessCallback, originalDataForSlideView } = this.props;

    const input = prepareParsedOrderInput(
      removeTypename(originalDataForSlideView),
      removeTypename(formData)
    );

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
  };

  initAllValues = (order: Object) => {
    const {
      orderItems = [],
      hasCalledItemsApiYet = false,
      hasCalledTasksApiYet = false,
      tags = [],
      files = [],
      todo = taskInitValues.todo,
      ...info
    } = order;
    orderInfoState.initDetailValues(info);
    orderItemState.initDetailValues(orderItems, hasCalledItemsApiYet || orderItems.length > 0);
    orderFilesState.initDetailValues(files);
    orderTasksState.initDetailValues(todo, hasCalledTasksApiYet || todo.tasks.length > 0);
    orderTagsState.initDetailValues(tags);
  };

  onMutationCompleted = (result: CreateOrderResponse) => {
    const { intl } = this.props;

    showToastError({ intl, result, entity: 'order' });
  };

  render() {
    const { onCancel } = this.props;
    return (
      <Provider
        inject={[
          orderItemState,
          orderInfoState,
          orderTagsState,
          orderFilesState,
          orderTasksState,
          form,
        ]}
      >
        <Mutation mutation={createOrderMutation} onCompleted={this.onMutationCompleted}>
          {(saveOrder, { loading: isLoading, error: apiError }) => (
            <SlideViewLayout>
              <SlideViewNavBar>
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
                <Subscribe
                  to={[
                    orderItemState,
                    orderInfoState,
                    orderTagsState,
                    orderFilesState,
                    orderTasksState,
                    form,
                  ]}
                >
                  {() => {
                    const isDirty =
                      orderItemState.isDirty() ||
                      orderInfoState.isDirty() ||
                      orderTagsState.isDirty() ||
                      orderFilesState.isDirty() ||
                      orderTasksState.isDirty();

                    return (
                      <>
                        <CancelButton onClick={onCancel} />

                        {isDirty && (
                          <SaveFormButton
                            id="order_form_save_button"
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
                                  this.initAllValues({
                                    ...updateOrder,
                                    hasCalledItemsApiYet: true,
                                    hasCalledTasksApiYet: true,
                                  });
                                  form.onReset();
                                },
                                form.onErrors
                              )
                            }
                          />
                        )}
                      </>
                    );
                  }}
                </Subscribe>
              </SlideViewNavBar>
              <Content>
                {apiError && <p>Error: Please try again.</p>}
                <OrderForm isNew />
              </Content>
            </SlideViewLayout>
          )}
        </Mutation>
      </Provider>
    );
  }
}

export default injectIntl(NewOrderForm);
