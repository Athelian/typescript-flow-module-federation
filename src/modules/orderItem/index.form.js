// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { Mutation } from 'react-apollo';
import { BooleanValue } from 'react-values';
import { showToastError } from 'utils/errors';
import { decodeId } from 'utils/id';
import { removeTypename, isForbidden } from 'utils/data';
import { getByPath } from 'utils/fp';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { NavBar, EntityIcon, LogsButton } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { QueryForm } from 'components/common';
import ResetFormButton from 'components/ResetFormButton';
import SaveFormButton from 'components/SaveFormButton';
import SlideView from 'components/SlideView';
import { FormContainer } from 'modules/form';
import Timeline from 'modules/timeline/components/Timeline';
import ItemForm from './form';
import { orderItemFormQuery, orderItemTimelineQuery } from './form/query';
import {
  OrderItemInfoContainer,
  OrderItemBatchesContainer,
  OrderItemFilesContainer,
  OrderItemTasksContainer,
  OrderItemShipmentsContainer,
} from './form/containers';
import validator from './form/validator';
import { updateOrderItemMutation, prepareParseOrderItemInput } from './form/mutation';

type Props = {
  orderItemId: string,
  isSlideView: boolean,
  intl: IntlShape,
};

const formContainer = new FormContainer();
class OrderItemFormModule extends React.Component<Props> {
  componentWillUnmount() {
    formContainer.onReset();
  }

  onFormReady = (
    {
      orderItemInfoContainer,
      orderItemBatchesContainer,
      orderItemFilesContainer,
      orderItemTasksContainer,
      orderItemShipmentsContainer,
    }: {
      orderItemInfoContainer: Object,
      orderItemBatchesContainer: Object,
      orderItemFilesContainer: Object,
      orderItemTasksContainer: Object,
      orderItemShipmentsContainer: Object,
    },
    orderItem: Object
  ) => {
    const hasInitialStateYet =
      (orderItemInfoContainer.state.id && orderItemInfoContainer.state.id === orderItem.id) ||
      Object.keys(orderItem).length === 0;
    if (hasInitialStateYet) return null;
    this.initAllValues(
      {
        orderItemInfoContainer,
        orderItemBatchesContainer,
        orderItemFilesContainer,
        orderItemTasksContainer,
        orderItemShipmentsContainer,
      },
      orderItem
    );
    return null;
  };

  initAllValues = (
    {
      orderItemInfoContainer,
      orderItemBatchesContainer,
      orderItemFilesContainer,
      orderItemTasksContainer,
      orderItemShipmentsContainer,
    }: {
      orderItemInfoContainer: Object,
      orderItemBatchesContainer: Object,
      orderItemFilesContainer: Object,
      orderItemTasksContainer: Object,
      orderItemShipmentsContainer: Object,
    },
    orderItem: Object
  ) => {
    const { batches, files, todo, shipments, ...rest } = orderItem;
    orderItemInfoContainer.initDetailValues(rest);
    orderItemBatchesContainer.initDetailValues({ batches });
    orderItemFilesContainer.initDetailValues(files);
    orderItemTasksContainer.initDetailValues(todo);
    orderItemShipmentsContainer.initDetailValues({ shipments });
  };

  onSave = async (
    originalValues: Object,
    formData: Object,
    updateOrderItem: Function,
    onSuccess: Object => void,
    onErrors: Function
  ) => {
    const { orderItemId } = this.props;
    const input = prepareParseOrderItemInput({
      originalValues: removeTypename(originalValues),
      newValues: removeTypename(formData),
    });
    const { data } = await updateOrderItem({ variables: { id: decodeId(orderItemId), input } });
    if (!data) return;
    const violations = getByPath('orderItemUpdate.violations', data);
    if (violations && violations.length) {
      onErrors(violations);
    } else if (!isForbidden(getByPath('orderItemUpdate', data)))
      onSuccess(getByPath('orderItemUpdate', data));
  };

  onMutationCompleted = (result: Object) => {
    const { intl } = this.props;
    showToastError({ result, intl, entity: 'orderItem' });
  };

  render() {
    const { orderItemId, isSlideView } = this.props;
    const CurrentNavBar = isSlideView ? SlideViewNavBar : NavBar;
    const CurrentLayout = isSlideView ? SlideViewLayout : React.Fragment;

    let mutationKey = {};
    if (orderItemId) {
      mutationKey = { key: decodeId(orderItemId) };
    }
    return (
      <Provider inject={[formContainer]}>
        <Mutation
          mutation={updateOrderItemMutation}
          onCompleted={this.onMutationCompleted}
          {...mutationKey}
        >
          {(updateOrderItem, { loading, error }) => (
            <CurrentLayout>
              <CurrentNavBar>
                <EntityIcon icon="ORDER_ITEM" color="ORDER_ITEM" />
                <JumpToSection>
                  <SectionTabs
                    link="orderItem_itemSection"
                    label={<FormattedMessage id="modules.item.item" defaultMessage="ITEM" />}
                    icon="ORDER_ITEM"
                  />
                  <SectionTabs
                    link="orderItem_batchesSection"
                    label={<FormattedMessage id="modules.item.batches" defaultMessage="BATCHES" />}
                    icon="BATCH"
                  />
                  <SectionTabs
                    link="orderItem_documentsSection"
                    label={
                      <FormattedMessage id="modules.item.documents" defaultMessage="DOCUMENTS" />
                    }
                    icon="DOCUMENT"
                  />
                  <SectionTabs
                    link="orderItem_taskSection"
                    label={<FormattedMessage id="modules.item.tasks" defaultMessage="TASKS" />}
                    icon="TASK"
                  />
                  <SectionTabs
                    link="orderItem_shipmentsSection"
                    label={
                      <FormattedMessage id="modules.item.shipments" defaultMessage="shipments" />
                    }
                    icon="SHIPMENT"
                  />
                </JumpToSection>

                <Subscribe
                  to={[
                    OrderItemInfoContainer,
                    OrderItemBatchesContainer,
                    OrderItemFilesContainer,
                    OrderItemTasksContainer,
                    OrderItemShipmentsContainer,
                    FormContainer,
                  ]}
                >
                  {(
                    orderItemInfoContainer,
                    orderItemBatchesContainer,
                    orderItemFilesContainer,
                    orderItemTasksContainer,
                    orderItemShipmentsContainer,
                    form
                  ) => (
                    <>
                      <BooleanValue>
                        {({ value: isOpen, set: toggleLogs }) => (
                          <>
                            <LogsButton
                              entityType="orderItem"
                              entityId={orderItemId}
                              onClick={() => toggleLogs(true)}
                            />
                            <SlideView isOpen={isOpen} onRequestClose={() => toggleLogs(false)}>
                              <SlideViewLayout>
                                {orderItemId && isOpen && (
                                  <>
                                    <SlideViewNavBar>
                                      <EntityIcon icon="LOGS" color="LOGS" />
                                    </SlideViewNavBar>

                                    <Content>
                                      <Timeline
                                        query={orderItemTimelineQuery}
                                        queryField="orderItem"
                                        variables={{
                                          id: decodeId(orderItemId),
                                        }}
                                        entity={{
                                          orderItemId: decodeId(orderItemId),
                                        }}
                                        users={orderItemInfoContainer.state.order.followers}
                                      />
                                    </Content>
                                  </>
                                )}
                              </SlideViewLayout>
                            </SlideView>
                          </>
                        )}
                      </BooleanValue>
                      {(orderItemInfoContainer.isDirty() ||
                        orderItemBatchesContainer.isDirty() ||
                        orderItemFilesContainer.isDirty() ||
                        orderItemTasksContainer.isDirty()) && (
                        <>
                          <ResetFormButton
                            onClick={() => {
                              this.initAllValues(
                                {
                                  orderItemInfoContainer,
                                  orderItemBatchesContainer,
                                  orderItemFilesContainer,
                                  orderItemTasksContainer,
                                  orderItemShipmentsContainer,
                                },
                                {
                                  ...orderItemInfoContainer.originalValues,
                                  ...orderItemBatchesContainer.originalValues,
                                  ...orderItemFilesContainer.originalValues,
                                  ...orderItemTasksContainer.originalValues,
                                  ...orderItemShipmentsContainer.originalValues,
                                }
                              );
                              form.onReset();
                            }}
                          />
                          <SaveFormButton
                            id="item_form_save_button"
                            disabled={
                              !formContainer.isReady(
                                {
                                  ...orderItemInfoContainer.state,
                                  ...orderItemBatchesContainer.state,
                                  ...orderItemFilesContainer.state,
                                  ...orderItemTasksContainer.state,
                                },
                                validator
                              )
                            }
                            isLoading={loading}
                            onClick={() =>
                              this.onSave(
                                {
                                  ...orderItemInfoContainer.originalValues,
                                  ...orderItemBatchesContainer.originalValues,
                                  ...orderItemFilesContainer.originalValues,
                                  ...orderItemTasksContainer.originalValues,
                                },
                                {
                                  ...orderItemInfoContainer.state,
                                  ...orderItemBatchesContainer.state,
                                  ...orderItemFilesContainer.state,
                                  ...orderItemTasksContainer.state,
                                },
                                updateOrderItem,
                                updateData => {
                                  this.initAllValues(
                                    {
                                      orderItemInfoContainer,
                                      orderItemBatchesContainer,
                                      orderItemFilesContainer,
                                      orderItemTasksContainer,
                                      orderItemShipmentsContainer,
                                    },
                                    updateData
                                  );
                                  form.onReset();
                                },
                                form.onErrors
                              )
                            }
                          />
                        </>
                      )}
                    </>
                  )}
                </Subscribe>
              </CurrentNavBar>
              <Content>
                {error && <p>Error: Please try again.</p>}
                <QueryForm
                  query={orderItemFormQuery}
                  entityId={orderItemId}
                  entityType="orderItem"
                  render={orderItem => (
                    <>
                      <ItemForm orderItem={orderItem} />
                      <Subscribe
                        to={[
                          OrderItemInfoContainer,
                          OrderItemBatchesContainer,
                          OrderItemFilesContainer,
                          OrderItemTasksContainer,
                          OrderItemShipmentsContainer,
                        ]}
                      >
                        {(
                          orderItemInfoContainer,
                          orderItemBatchesContainer,
                          orderItemFilesContainer,
                          orderItemTasksContainer,
                          orderItemShipmentsContainer
                        ) =>
                          this.onFormReady(
                            {
                              orderItemInfoContainer,
                              orderItemBatchesContainer,
                              orderItemFilesContainer,
                              orderItemShipmentsContainer,
                              orderItemTasksContainer,
                            },
                            orderItem
                          )
                        }
                      </Subscribe>
                    </>
                  )}
                />
              </Content>
            </CurrentLayout>
          )}
        </Mutation>
      </Provider>
    );
  }
}

export default injectIntl(OrderItemFormModule);
