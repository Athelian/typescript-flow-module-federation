// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Mutation } from 'react-apollo';
import { Provider, Subscribe } from 'unstated';
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

export default class OrderItemFormModule extends React.PureComponent<Props> {
  onFormReady = ({
    infoContainer,
    batchesContainer,
    filesContainer,
    tasksContainer,
    shipmentsContainer,
  }: {
    infoContainer: Object,
    batchesContainer: Object,
    filesContainer: Object,
    tasksContainer: Object,
    shipmentsContainer: Object,
  }) => (orderItem: Object) => {
    const { batches, files, todo, shipments, ...rest } = orderItem;
    infoContainer.initDetailValues(rest);
    batchesContainer.initDetailValues({ batches });
    filesContainer.initDetailValues({ files });
    tasksContainer.initDetailValues(todo);
    shipmentsContainer.initDetailValues({ shipments });
  };

  onSave = async (
    originalValues: Object,
    formData: Object,
    saveOrderItem: Function,
    onSuccess: Function,
    onErrors: Function
  ) => {
    const { orderItemId } = this.props;
    const input = prepareParseOrderItemInput({
      originalValues: removeTypename(originalValues),
      newValues: removeTypename(formData),
    });
    const result = await saveOrderItem({ variables: { id: decodeId(orderItemId), input } });
    if (result && result.data) {
      const { data } = result;
      const violations = getByPath('orderItemUpdate.violations', data);
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
      }
    }
  };

  onMutationCompleted = ({
    infoContainer,
    batchesContainer,
    filesContainer,
    tasksContainer,
    shipmentsContainer,
  }: {
    infoContainer: Object,
    batchesContainer: Object,
    filesContainer: Object,
    tasksContainer: Object,
    shipmentsContainer: Object,
  }) => (result: Object) => {
    if (!result) {
      toast.error('There was an error. Please try again later');
      return;
    }
    this.onFormReady({
      infoContainer,
      batchesContainer,
      filesContainer,
      tasksContainer,
      shipmentsContainer,
    })(result.orderItemUpdate);
  };

  render() {
    const { orderItemId, isSlideView } = this.props;
    const CurrentNavBar = isSlideView ? SlideViewNavBar : NavBar;

    let mutationKey = {};
    if (orderItemId) {
      mutationKey = { key: decodeId(orderItemId) };
    }
    return (
      <Provider>
        <UIConsumer>
          {uiState => (
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
                infoContainer,
                batchesContainer,
                filesContainer,
                tasksContainer,
                shipmentsContainer,
                formContainer
              ) => (
                <Mutation
                  mutation={updateOrderItemMutation}
                  onCompleted={this.onMutationCompleted({
                    infoContainer,
                    batchesContainer,
                    filesContainer,
                    shipmentsContainer,
                    tasksContainer,
                  })}
                  {...mutationKey}
                >
                  {(saveOrderItem, { loading, error }) => (
                    <Layout
                      {...(isSlideView ? {} : uiState)}
                      navBar={
                        <CurrentNavBar>
                          <EntityIcon icon="ORDER_ITEM" color="ORDER_ITEM" />
                          <JumpToSection>
                            <SectionTabs
                              link="orderItem_itemSection"
                              label={
                                <FormattedMessage id="modules.item.item" defaultMessage="ITEM" />
                              }
                              icon="ORDER_ITEM"
                            />
                            <SectionTabs
                              link="orderItem_batchesSection"
                              label={
                                <FormattedMessage
                                  id="modules.item.batches"
                                  defaultMessage="BATCHES"
                                />
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
                              label={
                                <FormattedMessage id="modules.item.tasks" defaultMessage="TASKS" />
                              }
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

                          {(infoContainer.isDirty() ||
                            batchesContainer.isDirty() ||
                            filesContainer.isDirty() ||
                            tasksContainer.isDirty()) && (
                            <>
                              <ResetButton
                                onClick={() => {
                                  resetFormState(infoContainer);
                                  resetFormState(batchesContainer);
                                  resetFormState(filesContainer);
                                  resetFormState(tasksContainer, 'todo');
                                  formContainer.onReset();
                                }}
                              />
                              <SaveButton
                                disabled={
                                  !formContainer.isReady(
                                    {
                                      ...infoContainer.state,
                                      ...batchesContainer.state,
                                      ...filesContainer.state,
                                      ...tasksContainer.state,
                                    },
                                    validator
                                  )
                                }
                                isLoading={loading}
                                onClick={() =>
                                  this.onSave(
                                    {
                                      ...infoContainer.originalValues,
                                      ...batchesContainer.originalValues,
                                      ...filesContainer.originalValues,
                                      ...tasksContainer.originalValues,
                                    },
                                    {
                                      ...infoContainer.state,
                                      ...batchesContainer.state,
                                      ...filesContainer.state,
                                      ...tasksContainer.state,
                                    },
                                    saveOrderItem,
                                    () => {
                                      infoContainer.onSuccess();
                                      batchesContainer.onSuccess();
                                      filesContainer.onSuccess();
                                      tasksContainer.onSuccess();
                                    },
                                    formContainer.onErrors
                                  )
                                }
                              />
                            </>
                          )}
                        </CurrentNavBar>
                      }
                    >
                      {error && <p>Error: Please try again.</p>}
                      <QueryForm
                        query={orderItemFormQuery}
                        entityId={orderItemId}
                        entityType="orderItem"
                        render={orderItem => (
                          <ItemForm
                            orderItem={orderItem}
                            onFormReady={() => {
                              this.onFormReady({
                                infoContainer,
                                batchesContainer,
                                filesContainer,
                                shipmentsContainer,
                                tasksContainer,
                              })(orderItem);
                            }}
                          />
                        )}
                      />
                    </Layout>
                  )}
                </Mutation>
              )}
            </Subscribe>
          )}
        </UIConsumer>
      </Provider>
    );
  }
}
