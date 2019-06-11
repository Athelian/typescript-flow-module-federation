// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { flatten } from 'lodash';
import { BooleanValue } from 'react-values';
import {
  findTotalAutoFillBatches,
  generateBatchByOrderItem,
  generateCloneBatch,
} from 'utils/batch';
import { getByPathWithDefault } from 'utils/fp';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import {
  BATCH_CREATE,
  BATCH_UPDATE,
  BATCH_DELETE,
  BATCH_SET_NO,
  BATCH_SET_QUANTITY,
  BATCH_SET_DELIVERY_DATE,
  BATCH_SET_DESIRED_DATE,
  BATCH_SET_QUANTITY_ADJUSTMENTS,
  BATCH_SET_CUSTOM_FIELDS,
  BATCH_SET_CUSTOM_FIELDS_MASK,
  BATCH_SET_TAGS,
} from 'modules/permission/constants/batch';
import { NewButton, BaseButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import { OrderBatchCard } from 'components/Cards';
import Icon from 'components/Icon';
import SlideView from 'components/SlideView';
import { Display } from 'components/Form';
import BatchFormInSlide from 'modules/batch/common/BatchFormInSlide';
import { HIDE, NAVIGABLE, READONLY } from 'modules/batch/constants';
import {
  BatchesAreaWrapperStyle,
  BatchesNavbarWrapperStyle,
  BatchesBodyWrapperStyle,
  BatchesHeaderWrapperStyle,
  BatchesTitleWrapperStyle,
  IconStyle,
  TitleStyle,
  AutofillButtonWrapperStyle,
  NoBatchesFoundStyle,
  BatchesGridStyle,
  BatchesFooterWrapperStyle,
} from './style';

type Props = {
  itemsIsExpanded: boolean,
  order: Object,
  orderItems: Array<Object>,
  setFieldValue: (string, any) => void,
  setFieldTouched: Function,
  focusedItemIndex: number,
  orderIsArchived: boolean,
};

function findOrderItemPosition({
  focusedItemIndex,
  orderItems,
  batches,
  batch,
}: {
  focusedItemIndex: number,
  orderItems: Array<Object>,
  batches: Array<Object>,
  batch: Object,
}) {
  let orderItemPosition = focusedItemIndex;
  let batchPosition = batches.findIndex(item => item.id === batch.id);
  if (orderItemPosition === -1) {
    orderItemPosition = orderItems.findIndex(orderItem =>
      orderItem.batches.map(({ id }) => id).includes(batch.id)
    );
    if (orderItemPosition >= 0) {
      batchPosition = orderItems[orderItemPosition].batches.findIndex(item => item.id === batch.id);
    }
  }
  return { orderItemPosition, batchPosition };
}

function BatchesArea({
  itemsIsExpanded,
  order,
  orderItems,
  setFieldValue,
  setFieldTouched,
  focusedItemIndex,
  orderIsArchived,
}: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const allowCloneBatch = hasPermission(BATCH_CREATE);
  const allowDeleteBatch = hasPermission(BATCH_DELETE);
  const allowUpdateBatchNo = hasPermission([BATCH_UPDATE, BATCH_SET_NO]);
  const allowUpdateBatchQuantity =
    hasPermission(BATCH_UPDATE) ||
    (hasPermission(BATCH_SET_QUANTITY) && hasPermission(BATCH_SET_QUANTITY_ADJUSTMENTS));
  const allowUpdateBatchDelivery = hasPermission([BATCH_UPDATE, BATCH_SET_DELIVERY_DATE]);
  const allowUpdateBatchDesired = hasPermission([BATCH_UPDATE, BATCH_SET_DESIRED_DATE]);

  const batches =
    focusedItemIndex === -1
      ? flatten(orderItems.map(({ batches: itemBatches }) => itemBatches))
      : getByPathWithDefault([], `${focusedItemIndex}.batches`, orderItems);

  return (
    <div className={BatchesAreaWrapperStyle(itemsIsExpanded)}>
      <div className={BatchesNavbarWrapperStyle} />

      <div className={BatchesBodyWrapperStyle}>
        <div className={BatchesHeaderWrapperStyle(itemsIsExpanded)}>
          <div className={BatchesTitleWrapperStyle}>
            <div className={IconStyle}>
              <Icon icon="BATCH" />
            </div>

            <div className={TitleStyle}>
              {focusedItemIndex === -1 ? (
                <FormattedMessage id="modules.Orders.allBatches" defaultMessage="ALL BATCHES" />
              ) : (
                <FormattedMessage id="modules.Orders.batches" defaultMessage="BATCHES" />
              )}
              {' ('}
              <FormattedNumber value={batches.length} />
              {')'}
            </div>
          </div>

          <div className={AutofillButtonWrapperStyle}>
            {orderItems.length > 0 && hasPermission(BATCH_CREATE) && (
              <BaseButton
                label={
                  focusedItemIndex === -1 ? (
                    <FormattedMessage
                      id="modules.Orders.autofillBatches"
                      defaultMessage="AUTOFILL BATCHES"
                    />
                  ) : (
                    <FormattedMessage
                      id="modules.Orders.autofillBatch"
                      defaultMessage="AUTOFILL BATCH"
                    />
                  )
                }
                onClick={() => {
                  if (focusedItemIndex === -1) {
                    const newOrderItems = orderItems.map(orderItem => {
                      const quantity = findTotalAutoFillBatches(orderItem);
                      if (quantity > 0) {
                        const newBatch = {
                          ...generateBatchByOrderItem(orderItem),
                          orderItem,
                          no: `batch no ${orderItem.batches.length + 1}`,
                          quantity,
                          archived: orderIsArchived,
                        };
                        return {
                          ...orderItem,
                          order,
                          batches: [
                            ...orderItem.batches,
                            {
                              ...newBatch,
                              orderItem: {
                                ...orderItem,
                                order,
                              },
                            },
                          ],
                        };
                      }
                      return orderItem;
                    });
                    setFieldValue('orderItems', newOrderItems);
                  } else {
                    const orderItem = orderItems[focusedItemIndex];
                    const quantity = findTotalAutoFillBatches(orderItem);
                    if (quantity > 0) {
                      const newBatch = {
                        ...generateBatchByOrderItem(orderItem),
                        orderItem,
                        no: `batch no ${orderItem.batches.length + 1}`,
                        quantity,
                        archived: orderIsArchived,
                      };
                      const newOrderItem = {
                        ...orderItem,
                        batches: [
                          ...orderItem.batches,
                          {
                            ...newBatch,
                            orderItem: {
                              ...orderItem,
                              order,
                            },
                          },
                        ],
                      };
                      setFieldValue(`orderItems.${focusedItemIndex}`, newOrderItem);
                    }
                  }
                }}
              />
            )}
          </div>
        </div>

        {batches.length > 0 ? (
          <div className={BatchesGridStyle}>
            {batches.map(batch => {
              const { orderItemPosition, batchPosition } = findOrderItemPosition({
                focusedItemIndex,
                batches,
                orderItems,
                batch,
              });
              return (
                <BooleanValue key={batch.id}>
                  {({ value: opened, set: slideToggle }) => (
                    <>
                      <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                        {opened && (
                          <BatchFormInSlide
                            batch={batch}
                            onSave={updatedBatch => {
                              slideToggle(false);
                              setFieldValue(
                                `orderItems.${orderItemPosition}.batches.${batchPosition}`,
                                updatedBatch
                              );
                            }}
                            itemConfig={READONLY}
                            shipmentConfig={NAVIGABLE}
                            containerConfig={NAVIGABLE}
                            orderConfig={HIDE}
                          />
                        )}
                      </SlideView>
                      <OrderBatchCard
                        price={orderItems[orderItemPosition].price}
                        editable={{
                          clone: allowCloneBatch,
                          delete: allowDeleteBatch,
                          no: allowUpdateBatchNo,
                          quantity: allowUpdateBatchQuantity,
                          deliveredAt: allowUpdateBatchDelivery,
                          desiredAt: allowUpdateBatchDesired,
                        }}
                        currency={order && order.currency}
                        batch={batch}
                        onClick={() => slideToggle(true)}
                        saveOnBlur={updatedBatch => {
                          setFieldValue(
                            `orderItems.${orderItemPosition}.batches.${batchPosition}`,
                            updatedBatch
                          );
                        }}
                        onRemove={() => {
                          const remainBatches = orderItems[orderItemPosition].batches.filter(
                            item => item.id !== batch.id
                          );
                          setFieldValue(`orderItems.${orderItemPosition}.batches`, remainBatches);
                        }}
                        onClone={newBatch => {
                          setFieldValue(`orderItems.${orderItemPosition}.batches`, [
                            ...(orderItems[orderItemPosition].batches || []),
                            {
                              ...generateCloneBatch(newBatch),
                              tags: hasPermission([BATCH_UPDATE, BATCH_SET_TAGS])
                                ? newBatch.tags
                                : [],
                              customFields: {
                                ...newBatch.customFields,
                                fieldValues: hasPermission([BATCH_UPDATE, BATCH_SET_CUSTOM_FIELDS])
                                  ? newBatch.customFields.fieldValues
                                  : [],
                                mask: hasPermission([BATCH_UPDATE, BATCH_SET_CUSTOM_FIELDS_MASK])
                                  ? newBatch.customFields.mask
                                  : null,
                              },
                            },
                          ]);
                        }}
                      />
                    </>
                  )}
                </BooleanValue>
              );
            })}
          </div>
        ) : (
          <div className={NoBatchesFoundStyle}>
            <Display align="center">
              <FormattedMessage
                id="modules.Orders.noBatchesFound"
                defaultMessage="No batches found"
              />
            </Display>
          </div>
        )}
      </div>

      <div className={BatchesFooterWrapperStyle}>
        {hasPermission(BATCH_CREATE) && focusedItemIndex >= 0 && (
          <NewButton
            label={<FormattedMessage id="modules.Orders.newBatch" defaultMessage="NEW BATCH" />}
            onClick={() => {
              const orderItem = orderItems[focusedItemIndex];
              const newBatch = {
                ...generateBatchByOrderItem(orderItem),
                orderItem: {
                  ...orderItem,
                  order,
                },
                no: `batch ${batches.length + 1}`,
                archived: orderIsArchived,
              };
              setFieldValue(`orderItems.${focusedItemIndex}.batches`, [...batches, newBatch]);
              setFieldTouched(`orderItems.${focusedItemIndex}.batches`);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default React.memo<Props>(BatchesArea);
