// @flow
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { BooleanValue } from 'react-values';
import { Provider, Subscribe } from 'unstated';
import { FormContainer, resetFormState } from 'modules/form';
import { notificationSeeByEntitiesMutation } from 'components/common/QueryFormV2/mutation';
import {
  OrderItemInfoContainer,
  OrderItemTasksContainer,
  OrderItemBatchesContainer,
  OrderItemFilesContainer,
  OrderItemShipmentsContainer,
} from 'modules/orderItem/form/containers';
import { orderItemTimelineQuery } from 'modules/orderItem/form/query';
import JumpToSection from 'components/JumpToSection';
import validator from 'modules/orderItem/form/validator';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import ItemForm from 'modules/orderItem/form';
import useUser from 'hooks/useUser';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon, LogsButton } from 'components/NavBar';
import SlideView from 'components/SlideView';
import Timeline from 'modules/timeline/components/Timeline';
import ResetFormButton from 'components/ResetFormButton';
import SaveFormButton from 'components/SaveFormButton';

type Props = {|
  orderItem: Object,
  onSave: Function,
  isNew: boolean,
|};

const formContainer = new FormContainer();
const ItemFormInSlide = ({ orderItem, onSave, isNew }: Props) => {
  const { user } = useUser();
  const [notificationSeeByEntities] = useMutation(notificationSeeByEntitiesMutation);
  useEffect(() => {
    return () => {
      // mark to read notification on close
      if (!isNew && orderItem?.id) {
        const notificationUnseenCount = orderItem?.notificationUnseenCount ?? 0;
        if (notificationUnseenCount > 0) {
          notificationSeeByEntities({
            variables: {
              entities: [
                {
                  orderItemId: orderItem?.id,
                },
              ],
            },
          });
        }
      }
    };
  }, [isNew, notificationSeeByEntities, orderItem]);

  useEffect(() => {
    return () => formContainer.onReset();
  });

  return (
    <Provider inject={[formContainer]}>
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
        ) => {
          return (
            <SlideViewLayout>
              <SlideViewNavBar>
                <EntityIcon icon="ORDER_ITEM" color="ORDER_ITEM" />
                <JumpToSection>
                  <SectionTabs
                    link="orderItem_itemSection"
                    label={
                      <FormattedMessage id="modules.OrderItems.orderItem" defaultMessage="ITEM" />
                    }
                    icon="BATCH"
                  />
                  <SectionTabs
                    link="orderItem_batchesSection"
                    label={
                      <FormattedMessage id="modules.OrderItems.batches" defaultMessage="BATCHES" />
                    }
                    icon="BATCH"
                  />
                  <SectionTabs
                    link="orderItem_documentsSection"
                    label={
                      <FormattedMessage
                        id="modules.OrderItems.document"
                        defaultMessage="DOCUMENTS"
                      />
                    }
                    icon="DOCUMENT"
                  />
                  <SectionTabs
                    link="orderItem_taskSection"
                    label={<FormattedMessage id="modules.OrderItems.task" defaultMessage="TASK" />}
                    icon="TASK"
                  />
                  <SectionTabs
                    link="orderItem_shipmentsSection"
                    label={
                      <FormattedMessage
                        id="modules.OrderItems.shipment"
                        defaultMessage="SHIPMENT"
                      />
                    }
                    icon="SHIPMENT"
                  />
                </JumpToSection>
                <BooleanValue>
                  {({ value: opened, set: slideToggle }) =>
                    !isNew && (
                      <>
                        <LogsButton
                          entityType="orderItem"
                          entityId={orderItem.id}
                          onClick={() => slideToggle(true)}
                        />
                        <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                          <SlideViewLayout>
                            {opened && (
                              <>
                                <SlideViewNavBar>
                                  <EntityIcon icon="LOGS" color="LOGS" />
                                </SlideViewNavBar>

                                <Content>
                                  <Timeline
                                    query={orderItemTimelineQuery}
                                    queryField="orderItem"
                                    variables={{
                                      id: orderItem.id,
                                    }}
                                    entity={{
                                      orderItemId: orderItem.id,
                                    }}
                                    users={orderItem.order.followers}
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
                {(orderItemInfoContainer.isDirty() ||
                  orderItemBatchesContainer.isDirty() ||
                  orderItemFilesContainer.isDirty() ||
                  orderItemTasksContainer.isDirty()) && (
                  <>
                    <ResetFormButton
                      onClick={() => {
                        resetFormState(orderItemInfoContainer);
                        resetFormState(orderItemBatchesContainer);
                        resetFormState(orderItemFilesContainer, 'files');
                        resetFormState(orderItemTasksContainer, 'todo');
                        formContainer.onReset();
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
                      onClick={() =>
                        onSave({
                          ...orderItemInfoContainer.state,
                          ...orderItemBatchesContainer.state,
                          ...orderItemFilesContainer.state,
                          ...orderItemTasksContainer.state,
                        })
                      }
                    />
                  </>
                )}
              </SlideViewNavBar>

              <Content>
                <ItemForm
                  isSlideView
                  orderItem={orderItem}
                  onFormReady={() => {
                    const { batches = [], files = [], todo = { tasks: [] }, ...rest } = orderItem;
                    const shipments = [];
                    batches.forEach(batch => {
                      if (batch.shipment && !shipments.includes(batch.shipment)) {
                        shipments.push(batch.shipment);
                      }
                    });
                    orderItemInfoContainer.initDetailValues(rest);
                    orderItemBatchesContainer.initDetailValues({ batches }, user.timezone);
                    orderItemFilesContainer.initDetailValues(files);
                    orderItemTasksContainer.initDetailValues(todo);
                    orderItemShipmentsContainer.initDetailValues({ shipments });
                  }}
                />
              </Content>
            </SlideViewLayout>
          );
        }}
      </Subscribe>
    </Provider>
  );
};

export default ItemFormInSlide;
