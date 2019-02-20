// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue, ArrayValue } from 'react-values';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import { findBatchQuantity } from 'utils/batch';
import { SectionNavBar } from 'components/NavBar';
import { NewButton, BaseButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import messages from 'modules/order/messages';
import { ORDER_CREATE, ORDER_UPDATE } from 'modules/permission/constants/order';
import { OrderInfoContainer, OrderItemsContainer } from 'modules/order/form/containers';
import { FormContainer } from 'modules/form';
import SelectProducts from 'modules/order/common/SelectProducts';
import usePermission from 'hooks/usePermission';
import ExpandButtons from './components/ExpandButtons';
import OrderItems from './components/OrderItems';
import { ItemsSectionWrapperStyle, ItemsSectionBodyStyle } from './style';

type Props = {
  intl: IntlShape,
  isNew: boolean,
};

function ItemSection({ intl, isNew }: Props) {
  const { hasPermission } = usePermission();

  const canCreateOrUpdate = hasPermission(ORDER_CREATE) || hasPermission(ORDER_UPDATE);

  return (
    <ArrayValue defaultValue={[]}>
      {({ value: selected, push, set }) => (
        <BooleanValue>
          {({ value: allItemsExpanded, set: toggleExpand }) => (
            <div className={ItemsSectionWrapperStyle}>
              <SectionNavBar>
                <ExpandButtons
                  type="COMPRESS"
                  onClick={() => {
                    toggleExpand(false);
                    set([]);
                  }}
                />
                <Subscribe to={[OrderItemsContainer]}>
                  {({ state: { orderItems } }) => (
                    <ExpandButtons
                      type="EXPAND"
                      onClick={() => {
                        toggleExpand(true);
                        set(orderItems.map(({ id }) => id));
                      }}
                    />
                  )}
                </Subscribe>
                {canCreateOrUpdate && (
                  <Subscribe to={[OrderInfoContainer]}>
                    {({ state: { exporter, currency } }) => (
                      <BooleanValue>
                        {({ value: opened, set: slideToggle }) => (
                          <>
                            <Subscribe to={[OrderItemsContainer]}>
                              {({ state: { orderItems }, setFieldValue }) => (
                                <>
                                  <BaseButton
                                    icon="SYNC"
                                    label={
                                      <FormattedMessage
                                        id="modules.order.syncAllPrice"
                                        defaultMessage="SYNC ALL PRICE"
                                      />
                                    }
                                    onClick={() => {
                                      const newOrderItems = orderItems.map(orderItem => {
                                        const unitPrice = getByPath(
                                          'productProvider.unitPrice',
                                          orderItem
                                        );
                                        if (unitPrice && unitPrice.currency === currency) {
                                          return { ...orderItem, ...{ price: unitPrice } };
                                        }
                                        return orderItem;
                                      });
                                      setFieldValue('orderItems', newOrderItems);
                                    }}
                                  />
                                  <NewButton
                                    label={intl.formatMessage(messages.newItems)}
                                    disabled={!((exporter && exporter.id) || !isNew)}
                                    onClick={() => slideToggle(true)}
                                  />
                                  <BaseButton
                                    label={intl.formatMessage(messages.autoFillBatch)}
                                    onClick={() => {
                                      const newOrderItems = orderItems.map(orderItem => {
                                        const totalBatchQuantity = orderItem.batches.reduce(
                                          (total, batch) => total + findBatchQuantity(batch),
                                          0
                                        );
                                        if (orderItem.quantity > totalBatchQuantity) {
                                          const {
                                            productProvider: {
                                              packageName,
                                              packageCapacity,
                                              packageGrossWeight,
                                              packageVolume,
                                              packageSize,
                                            },
                                          } = orderItem;
                                          return {
                                            ...orderItem,
                                            batches: [
                                              ...orderItem.batches,
                                              injectUid({
                                                orderItem,
                                                tags: [],
                                                packageName,
                                                packageCapacity,
                                                packageGrossWeight,
                                                packageVolume,
                                                packageSize,
                                                quantity: orderItem.quantity - totalBatchQuantity,
                                                isNew: true,
                                                batchAdjustments: [],
                                                no: `batch auto fill`,
                                              }),
                                            ],
                                          };
                                        }
                                        return orderItem;
                                      });
                                      setFieldValue('orderItems', newOrderItems);
                                    }}
                                  />
                                </>
                              )}
                            </Subscribe>
                            <SlideView
                              isOpen={opened}
                              onRequestClose={() => slideToggle(false)}
                              options={{ width: '1030px' }}
                            >
                              {opened && (
                                <Subscribe to={[OrderItemsContainer, FormContainer]}>
                                  {(
                                    { state: { orderItems }, setFieldValue },
                                    { setFieldTouched }
                                  ) => (
                                    <SelectProducts
                                      onSelect={selectedItems => {
                                        setFieldValue('orderItems', [
                                          ...orderItems,
                                          ...selectedItems.map(productProvider =>
                                            injectUid({
                                              productProvider,
                                              isNew: true,
                                              batches: [],
                                              quantity: 0,
                                              price: {
                                                amount:
                                                  getByPath(
                                                    'unitPrice.currency',
                                                    productProvider
                                                  ) === currency
                                                    ? getByPathWithDefault(
                                                        0,
                                                        'unitPrice.amount',
                                                        productProvider
                                                      )
                                                    : 0,
                                                currency,
                                              },
                                            })
                                          ),
                                        ]);
                                        setFieldTouched('orderItems');
                                        slideToggle(false);
                                      }}
                                      exporter={exporter && exporter.id}
                                      orderCurrency={currency}
                                      onCancel={() => slideToggle(false)}
                                    />
                                  )}
                                </Subscribe>
                              )}
                            </SlideView>
                          </>
                        )}
                      </BooleanValue>
                    )}
                  </Subscribe>
                )}
              </SectionNavBar>
              <div id="orderItemsSection" className={ItemsSectionBodyStyle}>
                <Subscribe to={[OrderInfoContainer, OrderItemsContainer, FormContainer]}>
                  {(
                    { state: { currency } },
                    { state: { orderItems }, setFieldValue, setFieldArrayValue },
                    { setFieldTouched }
                  ) => (
                    <OrderItems
                      selected={selected}
                      arrayHelpers={{ push, set }}
                      allItemsExpanded={allItemsExpanded}
                      currency={currency}
                      orderItems={orderItems}
                      onClone={({ id, ...rest }) => {
                        setFieldValue('orderItems', [
                          ...orderItems,
                          injectUid({
                            ...rest,
                            isNew: true,
                            batches: [],
                          }),
                        ]);
                        setFieldTouched(`orderItems.${id}`);
                      }}
                      onRemove={({ id }) => {
                        setFieldValue(
                          'orderItems',
                          orderItems.filter(({ id: itemId }) => id !== itemId)
                        );
                        setFieldTouched(`orderItems.${id}`);
                      }}
                      onSave={(index, newValue) => {
                        setFieldArrayValue(index, newValue);
                        setFieldTouched(`orderItems.${index}`);
                      }}
                    />
                  )}
                </Subscribe>
              </div>
            </div>
          )}
        </BooleanValue>
      )}
    </ArrayValue>
  );
}

export default injectIntl(ItemSection);
