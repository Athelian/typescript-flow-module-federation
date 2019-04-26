// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Mutation } from 'react-apollo';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { toast } from 'react-toastify';
import { decodeId } from 'utils/id';
import { removeTypename } from 'utils/data';
import { getByPath } from 'utils/fp';
import Layout from 'components/Layout';
import NavBar, { SlideViewNavBar, EntityIcon, LogsButton } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { QueryForm } from 'components/common';
import { ResetButton, SaveButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import { UIConsumer } from 'modules/ui';
import { FormContainer, resetFormState } from 'modules/form';
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
};

export default class OrderItemFormModule extends React.Component<Props> {
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
      orderItemInfoContainer.state.id || Object.keys(orderItem).length === 0;
    if (hasInitialStateYet) return null;

    const { batches, files, todo, shipments, ...rest } = orderItem;
    orderItemInfoContainer.initDetailValues(rest);
    orderItemBatchesContainer.initDetailValues({ batches });
    orderItemFilesContainer.initDetailValues({ files });
    orderItemTasksContainer.initDetailValues(todo);
    orderItemShipmentsContainer.initDetailValues({ shipments });

    return null;
  };

  onReset = ({
    orderItemInfoContainer,
    orderItemBatchesContainer,
    orderItemFilesContainer,
    orderItemTasksContainer,
    orderItemShipmentsContainer,
    formContainer,
  }: {
    orderItemInfoContainer: Object,
    orderItemBatchesContainer: Object,
    orderItemFilesContainer: Object,
    orderItemTasksContainer: Object,
    orderItemShipmentsContainer: Object,
    formContainer: Object,
  }) => {
    resetFormState(orderItemInfoContainer);
    resetFormState(orderItemBatchesContainer);
    resetFormState(orderItemFilesContainer);
    resetFormState(orderItemTasksContainer, 'todo');
    resetFormState(orderItemShipmentsContainer);
    formContainer.onReset();
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
    const result = await updateOrderItem({ variables: { id: decodeId(orderItemId), input } });
    if (result && result.data) {
      const { data } = result;
      const violations = getByPath('orderItemUpdate.violations', data);
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess(getByPath('orderItemUpdate', data));
      }
    }
  };

  onMutationCompleted = (result: Object) => {
    if (!result) {
      toast.error('There was an error. Please try again later');
    }
  };

  render() {
    const { orderItemId, isSlideView } = this.props;
    const CurrentNavBar = isSlideView ? SlideViewNavBar : NavBar;

    let mutationKey = {};
    if (orderItemId) {
      mutationKey = { key: decodeId(orderItemId) };
    }
    return (
      <UIConsumer>
        {uiState => (
          <Mutation
            mutation={updateOrderItemMutation}
            onCompleted={this.onMutationCompleted}
            {...mutationKey}
          >
            {(updateOrderItem, { loading, error }) => (
              <Layout
                {...(isSlideView ? {} : uiState)}
                navBar={
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
                        label={
                          <FormattedMessage id="modules.item.batches" defaultMessage="BATCHES" />
                        }
                        icon="BATCH"
                      />
                      <SectionTabs
                        link="orderItem_documentsSection"
                        label={
                          <FormattedMessage
                            id="modules.item.documents"
                            defaultMessage="DOCUMENTS"
                          />
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
                          <FormattedMessage
                            id="modules.item.shipments"
                            defaultMessage="shipments"
                          />
                        }
                        icon="SHIPMENT"
                      />
                    </JumpToSection>
                    <BooleanValue>
                      {({ value: isOpen, set: toggleLogs }) => (
                        <>
                          <LogsButton onClick={() => toggleLogs(true)} />
                          <SlideView isOpen={isOpen} onRequestClose={() => toggleLogs(false)}>
                            <Layout
                              navBar={
                                <SlideViewNavBar>
                                  <EntityIcon icon="LOGS" color="LOGS" />
                                </SlideViewNavBar>
                              }
                            >
                              {orderItemId && isOpen ? (
                                <Timeline
                                  query={orderItemTimelineQuery}
                                  queryField="orderItem"
                                  variables={{
                                    id: decodeId(orderItemId),
                                  }}
                                  entity={{
                                    orderId: decodeId(orderItemId),
                                  }}
                                />
                              ) : null}
                            </Layout>
                          </SlideView>
                        </>
                      )}
                    </BooleanValue>

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
                        formContainer
                      ) => (
                        <>
                          {(orderItemInfoContainer.isDirty() ||
                            orderItemBatchesContainer.isDirty() ||
                            orderItemFilesContainer.isDirty() ||
                            orderItemTasksContainer.isDirty()) && (
                            <>
                              <ResetButton
                                onClick={() => {
                                  this.onReset({
                                    orderItemInfoContainer,
                                    orderItemBatchesContainer,
                                    orderItemFilesContainer,
                                    orderItemTasksContainer,
                                    orderItemShipmentsContainer,
                                    formContainer,
                                  });
                                }}
                              />
                              <SaveButton
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
                                      const {
                                        batches,
                                        files,
                                        todo,
                                        shipments,
                                        ...rest
                                      } = updateData;
                                      orderItemInfoContainer.initDetailValues(rest);
                                      orderItemBatchesContainer.initDetailValues({ batches });
                                      orderItemFilesContainer.initDetailValues({ files });
                                      orderItemTasksContainer.initDetailValues(todo);
                                      orderItemShipmentsContainer.initDetailValues({ shipments });
                                      formContainer.onReset();
                                    },
                                    formContainer.onErrors
                                  )
                                }
                              />
                            </>
                          )}
                        </>
                      )}
                    </Subscribe>
                  </CurrentNavBar>
                }
              >
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
              </Layout>
            )}
          </Mutation>
        )}
      </UIConsumer>
    );
  }
}
