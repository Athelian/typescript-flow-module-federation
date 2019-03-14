// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue, ArrayValue } from 'react-values';
import { Subscribe } from 'unstated';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import scrollIntoView from 'utils/scrollIntoView';
import { OrderItemsContainer } from 'modules/order/form/containers';
import { ORDER_UPDATE, ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/order';
import { BatchInfoContainer, BatchTasksContainer } from 'modules/batch/form/containers';
import { getBatchByFillBatch } from 'modules/order/helpers';
import { injectUid } from 'utils/id';
import SlideView from 'components/SlideView';
import { OrderItemCard, OrderBatchCard } from 'components/Cards';
import { NewButton, BaseButton } from 'components/Buttons';
import Icon from 'components/Icon';
import BatchFormWrapper from 'modules/batch/common/BatchFormWrapper';
import validator from 'modules/batch/form/validator';
import {
  ItemGridStyle,
  ItemStyle,
  BatchAreaStyle,
  BatchAreaHeaderStyle,
  TitleWrapperStyle,
  TitleStyle,
  IconStyle,
  BatchGridStyle,
  EmptyMessageStyle,
} from './style';

type Props = {
  selected: Array<string>,
  orderItems: Array<Object>,
  currency: string,
  arrayHelpers: {
    push: Function,
    set: Function,
  },
  onClone: Function,
  onRemove: Function,
  onSave: Function,
};

export function generateBatchItem(orderItem: Object, batches: Array<Object>) {
  const {
    productProvider: {
      packageName,
      packageCapacity,
      packageGrossWeight,
      packageVolume,
      packageSize,
    },
  } = orderItem;
  return injectUid({
    orderItem,
    tags: [],
    packageName,
    packageCapacity,
    packageGrossWeight,
    packageVolume,
    packageSize,
    quantity: 0,
    isNew: true,
    batchAdjustments: [],
    no: `batch no ${batches.length + 1}`,
    autoCalculatePackageQuantity: true,
    todo: {
      tasks: [],
    },
  });
}

const OrderItems = ({
  selected,
  orderItems,
  currency,
  arrayHelpers: { push, set },
  onClone,
  onRemove,
  onSave,
}: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const allowUpdate = hasPermission(ORDER_UPDATE);
  return orderItems.length > 0 ? (
    <div className={ItemGridStyle}>
      {orderItems.map((item, index) => (
        <div id={`orderItem_${item.id}`} className={ItemStyle} key={item.id}>
          <OrderItemCard
            viewPrice={hasPermission(ORDER_ITEMS_GET_PRICE)}
            readOnly={!allowUpdate}
            item={item}
            currency={currency}
            saveOnBlur={newValue => onSave(index, newValue)}
            selected={selected.includes(item.id)}
            onClick={() => {
              scrollIntoView({
                targetId: `orderItem_${item.id}`,
                boundaryId: 'orderItemsSection',
              });
              if (!selected.includes(item.id)) {
                push(item.id);
              } else {
                set(selected.filter(selectedId => selectedId !== item.id));
              }
            }}
            onClone={onClone}
            onRemove={onRemove}
          />

          {selected.includes(item.id) &&
            (item.batches && (
              <ArrayValue value={item.batches} onChange={batches => onSave(index, { batches })}>
                {({ value: batches, push: addNewBatch, splice: changeBatch, filter }) => (
                  <div className={BatchAreaStyle}>
                    <div className={BatchAreaHeaderStyle}>
                      <div className={TitleWrapperStyle}>
                        <div className={IconStyle}>
                          <Icon icon="BATCH" />
                        </div>
                        <div className={TitleStyle}>BATCHES ({batches.length})</div>
                      </div>
                      {allowUpdate && (
                        <>
                          <NewButton
                            label={
                              <FormattedMessage
                                id="modules.Orders.newBatch"
                                defaultMessage="NEW BATCH"
                              />
                            }
                            onClick={() => addNewBatch(generateBatchItem(item, batches))}
                          />
                          <BaseButton
                            label={
                              <FormattedMessage
                                id="modules.Orders.autoFillBatch"
                                defaultMessage="AUTOFILL BATCH"
                              />
                            }
                            onClick={() => {
                              const newBatch = getBatchByFillBatch(item);
                              if (newBatch) {
                                addNewBatch(newBatch);
                              }
                            }}
                          />
                        </>
                      )}
                    </div>

                    <div className={BatchGridStyle}>
                      {batches.map((batch, position) => (
                        <BooleanValue key={batch.id}>
                          {({ value: opened, set: slideToggle }) => (
                            <>
                              <SlideView
                                isOpen={opened}
                                onRequestClose={() => slideToggle(false)}
                                options={{ width: '1030px' }}
                              >
                                {opened && (
                                  <Subscribe
                                    to={[
                                      BatchInfoContainer,
                                      BatchTasksContainer,
                                      OrderItemsContainer,
                                    ]}
                                  >
                                    {(batchInfoContainer, batchTasksContainer, { state }) => (
                                      <BatchFormWrapper
                                        batch={state.orderItems[index].batches[position]}
                                        isNew={!!batch.isNew}
                                        orderItem={item}
                                        initDetailValues={initValues => {
                                          const { todo, ...info } = initValues;
                                          batchInfoContainer.initDetailValues(info);
                                          batchTasksContainer.initDetailValues(todo);
                                        }}
                                        onCancel={() => slideToggle(false)}
                                        isReady={formContainer =>
                                          (formContainer.isReady(
                                            {
                                              ...batchInfoContainer.state,
                                              ...batchTasksContainer.state,
                                            },
                                            validator
                                          ) &&
                                            batchInfoContainer.isDirty()) ||
                                          batchTasksContainer.isDirty()
                                        }
                                        onSave={() => {
                                          const updatedBatch = {
                                            ...batchInfoContainer.state,
                                            ...batchTasksContainer.state,
                                          };
                                          slideToggle(false);
                                          changeBatch(position, 1, updatedBatch);
                                        }}
                                      />
                                    )}
                                  </Subscribe>
                                )}
                              </SlideView>
                              <OrderBatchCard
                                readOnly={!allowUpdate}
                                batch={batch}
                                currency={currency}
                                price={item.price}
                                onClick={() => slideToggle(true)}
                                saveOnBlur={updatedBatch => {
                                  changeBatch(position, 1, updatedBatch);
                                }}
                                onRemove={() => filter(({ id }) => id !== batch.id)}
                                onClone={({
                                  id,
                                  deliveredAt,
                                  desiredAt,
                                  expiredAt,
                                  producedAt,
                                  no,
                                  ...rest
                                }) => {
                                  changeBatch(
                                    batches.length,
                                    1,
                                    injectUid({
                                      ...rest,
                                      batchAdjustments: [],
                                      no: `${no}- clone`,
                                      isNew: true,
                                    })
                                  );
                                }}
                              />
                            </>
                          )}
                        </BooleanValue>
                      ))}
                    </div>
                  </div>
                )}
              </ArrayValue>
            ))}
        </div>
      ))}
    </div>
  ) : (
    <div className={EmptyMessageStyle}>
      <FormattedMessage
        id="modules.Orders.form.noItems"
        defaultMessage="No items found (needs Exporter to be chosen first as well)"
      />
    </div>
  );
};

export default OrderItems;
