// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue, ArrayValue } from 'react-values';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import scrollIntoView from 'utils/scrollIntoView';
import { ORDER_UPDATE, ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/order';
import { getBatchByFillBatch, generateBatchItem } from 'modules/order/helpers';
import SlideView from 'components/SlideView';
import { ItemCard, OrderBatchCard, CardAction } from 'components/Cards';
import RemoveDialog from 'components/Dialog/RemoveDialog';
import { NewButton, BaseButton } from 'components/Buttons';
import Icon from 'components/Icon';
import BatchFormInSlide from 'modules/batch/common/BatchFormInSlide';
import { generateBatchForClone } from 'utils/batch';
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
  orderItems: Array<Object>,
  order: {
    exporter: {
      id: string,
      name: string,
    },
    currency: string,
  },
  setFieldValue: Function,
  selected: Array<string>,
  arrayHelpers: {
    push: Function,
    set: Function,
  },
  onClone: Function,
  onRemove: Function,
  onSave: Function,
};

const OrderItems = ({
  order,
  setFieldValue,
  selected,
  orderItems,
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
      {orderItems.map((item, index) => {
        const {
          id,
          no,
          quantity,
          price,
          totalBatched,
          totalShipped,
          batchCount,
          batchShippedCount,
          productProvider,
          batches,
        } = item;
        const compiledOrderItem = {
          id,
          no,
          quantity,
          price,
          totalBatched,
          totalShipped,
          batchCount,
          batchShippedCount,
        };

        const { supplier, unitPrice, product } = productProvider;
        const { exporter } = order;
        const compiledProductProvider = {
          exporter,
          supplier,
          unitPrice,
        };

        const { id: productId, name, serial, tags, files } = product;
        const compiledProduct = {
          id: productId,
          name,
          serial,
          tags,
          files,
        };

        const { currency } = order;
        const compiledOrder = {
          currency,
        };

        const compiledBatches = batches.map(
          ({ quantity: batchQuantity, batchAdjustments, shipment }) => ({
            quantity: batchQuantity,
            batchAdjustments: batchAdjustments.map(({ quantity: adjustmentQuantity }) => ({
              quantity: adjustmentQuantity,
            })),
            shipment,
          })
        );

        const actions = [
          allowUpdate && <CardAction icon="CLONE" onClick={() => onClone(item)} />,
          allowUpdate && (
            <BooleanValue>
              {({ value: isOpen, set: dialogToggle }) =>
                batches.length > 0 ? (
                  <>
                    <RemoveDialog
                      isOpen={isOpen}
                      onRequestClose={() => dialogToggle(false)}
                      onCancel={() => dialogToggle(false)}
                      onRemove={() => {
                        onRemove(item);
                        dialogToggle(false);
                      }}
                      message={
                        <div>
                          <div>
                            <FormattedMessage
                              id="components.cards.deleteOrderItem"
                              defaultMessage="Are you sure you want to delete this Item?"
                            />
                          </div>
                          <div>
                            <FormattedMessage
                              id="components.cards.deleteOrderItemBatches"
                              defaultMessage="This will delete all {batches} of its Batches as well."
                              values={{ batches: item.batches.length }}
                            />
                          </div>
                          {item.batches.filter(batch => batch.shipment).length > 0 && (
                            <div>
                              <FormattedMessage
                                id="components.cards.deleteOrderItemShipments"
                                defaultMessage="Warning: {shipment} of the Batches are in a Shipment."
                                values={{
                                  shipment: item.batches.filter(batch => batch.shipment).length,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      }
                    />
                    <CardAction
                      icon="REMOVE"
                      hoverColor="RED"
                      onClick={() => {
                        dialogToggle(true);
                      }}
                    />
                  </>
                ) : (
                  <CardAction
                    icon="REMOVE"
                    hoverColor="RED"
                    onClick={() => {
                      onRemove(item);
                    }}
                  />
                )
              }
            </BooleanValue>
          ),
        ].filter(Boolean);

        const editable = {
          no: allowUpdate,
          quantity: allowUpdate,
          price: allowUpdate,
        };

        const viewable = {
          price: hasPermission(ORDER_ITEMS_GET_PRICE),
        };

        const config = {
          hideOrder: true,
        };

        return (
          <div id={`orderItem_${item.id}`} className={ItemStyle} key={item.id}>
            <ItemCard
              orderItem={compiledOrderItem}
              productProvider={compiledProductProvider}
              product={compiledProduct}
              order={compiledOrder}
              batches={compiledBatches}
              index={index}
              actions={actions}
              setFieldValue={setFieldValue}
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
              editable={editable}
              viewable={viewable}
              config={config}
            />

            {selected.includes(item.id) &&
              (batches && (
                <ArrayValue
                  value={batches}
                  onChange={newBatches => onSave(index, { batches: newBatches })}
                >
                  {({ value: currentBatches, push: addNewBatch, splice: changeBatch, filter }) => (
                    <div className={BatchAreaStyle}>
                      <div className={BatchAreaHeaderStyle}>
                        <div className={TitleWrapperStyle}>
                          <div className={IconStyle}>
                            <Icon icon="BATCH" />
                          </div>
                          <div className={TitleStyle}>BATCHES ({currentBatches.length})</div>
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
                              onClick={() => addNewBatch(generateBatchItem(item, currentBatches))}
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
                        {currentBatches.map((batch, position) => (
                          <BooleanValue key={batch.id}>
                            {({ value: opened, set: slideToggle }) => (
                              <>
                                <SlideView
                                  isOpen={opened}
                                  onRequestClose={() => slideToggle(false)}
                                >
                                  {opened && (
                                    <BatchFormInSlide
                                      batch={batch}
                                      onSave={value => {
                                        slideToggle(false);
                                        changeBatch(position, 1, value);
                                      }}
                                    />
                                  )}
                                </SlideView>
                                <OrderBatchCard
                                  editable={allowUpdate}
                                  batch={batch}
                                  currency={currency}
                                  price={item.price}
                                  onClick={() => slideToggle(true)}
                                  saveOnBlur={updatedBatch => {
                                    changeBatch(position, 1, updatedBatch);
                                  }}
                                  onRemove={() => filter(({ id: batchId }) => batchId !== batch.id)}
                                  onClone={value => {
                                    changeBatch(batches.length, 1, generateBatchForClone(value));
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
        );
      })}
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
