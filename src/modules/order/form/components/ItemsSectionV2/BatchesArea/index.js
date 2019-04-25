// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { getBatchByFillBatch } from 'modules/order/helpers';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { NewButton, BaseButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import { OrderBatchCard } from 'components/Cards';
import Icon from 'components/Icon';
import SlideView from 'components/SlideView';
import BatchFormInSlide from 'modules/batch/common/BatchFormInSlide';
import { ORDER_UPDATE } from 'modules/permission/constants/order';
import {
  BatchesAreaWrapperStyle,
  BatchesNavbarWrapperStyle,
  BatchesBodyWrapperStyle,
  BatchesHeaderWrapperStyle,
  BatchesTitleWrapperStyle,
  IconStyle,
  TitleStyle,
  AutofillButtonWrapperStyle,
  BatchesGridStyle,
  BatchesFooterWrapperStyle,
} from './style';

type Props = {
  itemsIsExpanded: boolean,
  order: Object,
  batches: Array<Object>,
  orderItems: Array<Object>,
  setFieldValue: (string, any) => void,
  setFieldTouched: Function,
  focusedItemIndex: number,
};

function findOrderItemPosition({
  focusedItemIndex,
  orderItems,
  batch,
}: {
  focusedItemIndex: number,
  orderItems: Array<Object>,
  batch: Object,
}) {
  let orderItemPosition = focusedItemIndex;
  if (orderItemPosition === -1) {
    orderItemPosition = orderItems.findIndex(orderItem =>
      orderItem.batches.map(({ id }) => id).includes(batch.id)
    );
  }
  return orderItemPosition;
}

function ItemsArea({
  itemsIsExpanded,
  batches,
  order,
  orderItems,
  setFieldValue,
  setFieldTouched,
  focusedItemIndex,
}: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const allowUpdate = hasPermission(ORDER_UPDATE);

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
            {orderItems.length > 0 && (
              <BaseButton
                label={
                  <FormattedMessage
                    id="modules.Orders.autofillBatch"
                    defaultMessage="AUTOFILL BATCH"
                  />
                }
                onClick={() => {
                  if (focusedItemIndex === -1) {
                    const newOrderItems = orderItems.map(orderItem => {
                      const newBatch = getBatchByFillBatch(orderItem);
                      if (newBatch) {
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
                    const newBatch = getBatchByFillBatch(orderItem);
                    if (newBatch) {
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

        <div className={BatchesGridStyle}>
          {batches.map((batch, position) => {
            const orderItemPosition = findOrderItemPosition({
              focusedItemIndex,
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
                              `orderItems.${orderItemPosition}.batches.${position}`,
                              updatedBatch
                            );
                          }}
                        />
                      )}
                    </SlideView>
                    <OrderBatchCard
                      price={orderItems[orderItemPosition].price}
                      editable={allowUpdate}
                      currency={order && order.currency}
                      batch={batch}
                      onClick={() => slideToggle(true)}
                      saveOnBlur={updatedBatch => {
                        setFieldValue(
                          `orderItems.${orderItemPosition}.batches.${position}`,
                          updatedBatch
                        );
                      }}
                      onRemove={() => {
                        batches.splice(batches.findIndex(item => item.id === batch.id), 1);
                        setFieldValue(`orderItems.${orderItemPosition}.batches`, batches);
                      }}
                      onClone={newBatch => {
                        setFieldValue(`orderItems.${orderItemPosition}.batches`, [
                          ...batches,
                          {
                            ...newBatch,
                            no: `${newBatch.no}- clone`,
                            id: Date.now(),
                            batchAdjustments: [],
                            todo: {
                              tasks: [],
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
      </div>

      <div className={BatchesFooterWrapperStyle}>
        {allowUpdate && focusedItemIndex >= 0 && (
          <NewButton
            label={<FormattedMessage id="modules.Orders.newBatch" defaultMessage="NEW BATCH" />}
            onClick={() => {
              const orderItem = orderItems[focusedItemIndex];
              const {
                productProvider: {
                  packageName,
                  packageCapacity,
                  packageGrossWeight,
                  packageVolume,
                  packageSize,
                },
              } = orderItem;
              const newBatch = {
                orderItem: {
                  ...orderItem,
                  order,
                },
                id: Date.now(),
                no: `batch ${batches.length + 1}`,
                tags: [],
                packageName,
                packageCapacity,
                packageGrossWeight,
                packageVolume,
                packageSize,
                quantity: 0,
                packageQuantity: 0,
                batchAdjustments: [],
                autoCalculatePackageQuantity: true,
                todo: {
                  tasks: [],
                },
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

export default React.memo<Props>(ItemsArea);
