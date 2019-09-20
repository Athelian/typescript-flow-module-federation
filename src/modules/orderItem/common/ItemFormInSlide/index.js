// @flow
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { FormContainer, resetFormState } from 'modules/form';
import {
  OrderItemInfoContainer,
  OrderItemTasksContainer,
  OrderItemBatchesContainer,
  OrderItemFilesContainer,
  OrderItemShipmentsContainer,
} from 'modules/orderItem/form/containers';
import JumpToSection from 'components/JumpToSection';
import validator from 'modules/orderItem/form/validator';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import ItemForm from 'modules/orderItem/form';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import { SaveButton, ResetButton } from 'components/Buttons';

type Props = {
  orderItem: Object,
  onSave: Function,
};

// FIXME: re confirm concept.
const formContainer = new FormContainer();
// FIXME: move into /form folder
const ItemFormInSlide = ({ orderItem, onSave }: Props) => {
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
                {(orderItemInfoContainer.isDirty() ||
                  orderItemBatchesContainer.isDirty() ||
                  orderItemFilesContainer.isDirty() ||
                  orderItemTasksContainer.isDirty()) && (
                  <>
                    <ResetButton
                      onClick={() => {
                        resetFormState(orderItemInfoContainer);
                        resetFormState(orderItemBatchesContainer);
                        resetFormState(orderItemFilesContainer);
                        resetFormState(orderItemTasksContainer, 'todo');
                        formContainer.onReset();
                      }}
                    />
                    <SaveButton
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
                    orderItemBatchesContainer.initDetailValues({ batches });
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
