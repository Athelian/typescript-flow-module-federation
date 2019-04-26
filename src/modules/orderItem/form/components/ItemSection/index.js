import React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Subscribe } from 'unstated';
import usePermission from 'hooks/usePermission';
import { ORDER_ITEMS_UPDATE } from 'modules/permission/constants/orderItem';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import { encodeId } from 'utils/id';
import { getItemQuantityChartData } from 'utils/item';
import { OrderProductProviderCard, OrderCard } from 'components/Cards';
import GridColumn from 'components/GridColumn';
import { FormField } from 'modules/form';
import {
  TextInputFactory,
  NumberInputFactory,
  CustomFieldsFactory,
  FieldItem,
  Label,
  TagsInput,
  TextAreaInputFactory,
} from 'components/Form';
import {
  OrderItemInfoContainer,
  OrderItemBatchesContainer,
} from 'modules/orderItem/form/containers';
import validator from 'modules/orderItem/form/validator';
import { ItemSectionWrapperStyle, MainFieldsWrapperStyle, DividerStyle } from './style';
import OrderItemSummaryChart from './components/OrderItemSummaryChart';

const ItemSection = () => {
  const { hasPermission } = usePermission();
  const allowUpdate = hasPermission(ORDER_ITEMS_UPDATE);
  return (
    <div className={ItemSectionWrapperStyle}>
      <Subscribe to={[OrderItemInfoContainer]}>
        {({ originalValues, state, setFieldValue, setDeepFieldValue }) => {
          const values = { ...originalValues, ...state };

          const { price, quantity } = values;

          const totalPrice = {
            amount: price.amount * quantity,
            currency: price.currency,
          };
          return (
            <>
              <div className={MainFieldsWrapperStyle}>
                <GridColumn>
                  <FormField
                    name="no"
                    initValue={values.no}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validator}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        name={name}
                        {...inputHandlers}
                        required
                        originalValue={originalValues[name]}
                        label={
                          <FormattedMessage id="module.OrderItems.no" defaultMessage="ITEM NO" />
                        }
                        editable={allowUpdate}
                      />
                    )}
                  </FormField>

                  <FormField
                    name="quantity"
                    initValue={values.quantity}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validator}
                  >
                    {({ name, ...inputHandlers }) => (
                      <NumberInputFactory
                        name={name}
                        {...inputHandlers}
                        required
                        originalValue={originalValues[name]}
                        label={
                          <FormattedMessage
                            id="modules.OrderItems.quantity"
                            defaultMessage="QUANTITY"
                          />
                        }
                        editable={allowUpdate}
                      />
                    )}
                  </FormField>

                  <FormField
                    name="price.amount"
                    initValue={getByPath('price.amount', values)}
                    setFieldValue={setDeepFieldValue}
                    values={values}
                    validator={validator}
                  >
                    {({ name, ...inputHandlers }) => (
                      <NumberInputFactory
                        name={name}
                        {...inputHandlers}
                        required
                        originalValue={getByPath('price.amount', originalValues)}
                        label={
                          <FormattedMessage
                            id="modules.OrderItems.unitPrice"
                            defaultMessage="UNIT PRICE"
                          />
                        }
                        suffix={getByPathWithDefault('', 'order.currency', values)}
                        editable={allowUpdate}
                      />
                    )}
                  </FormField>

                  <CustomFieldsFactory
                    entityType="OrderItem"
                    customFields={values.customFields}
                    setFieldValue={setFieldValue}
                    editable={{
                      values: allowUpdate,
                      mask: allowUpdate,
                    }}
                  />

                  <FieldItem
                    vertical
                    label={
                      <Label height="30px">
                        <FormattedMessage id="modules.OrderItems.tags" defaultMessage="TAGS" />
                      </Label>
                    }
                    input={
                      <TagsInput
                        id="tags"
                        name="tags"
                        tagType="OrderItem"
                        values={values.tags}
                        onChange={(field, value) => {
                          setFieldValue(field, value);
                        }}
                        editable={{
                          set: allowUpdate,
                          remove: allowUpdate,
                        }}
                      />
                    }
                  />

                  <FormField
                    name="memo"
                    initValue={values.memo}
                    values={values}
                    validator={validator}
                    setFieldValue={setFieldValue}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextAreaInputFactory
                        name={name}
                        {...inputHandlers}
                        originalValue={originalValues[name]}
                        label={
                          <FormattedMessage id="modules.OrderItems.memo" defaultMessage="MEMO" />
                        }
                        editable={allowUpdate}
                        vertical
                        inputWidth="400px"
                        inputHeight="65px"
                      />
                    )}
                  </FormField>

                  <div className={DividerStyle} />
                  <Subscribe to={[OrderItemBatchesContainer]}>
                    {({ state: { batches } }) => {
                      const {
                        orderedQuantity,
                        batchedQuantity,
                        shippedQuantity,
                      } = getItemQuantityChartData({
                        orderItem: values,
                        batches,
                      });
                      return (
                        <OrderItemSummaryChart
                          orderedQuantity={orderedQuantity}
                          batchedQuantity={batchedQuantity}
                          shippedQuantity={shippedQuantity}
                          totalPrice={totalPrice}
                        />
                      );
                    }}
                  </Subscribe>
                </GridColumn>

                <GridColumn>
                  <Label>
                    <FormattedMessage
                      id="modules.OrderItems.endProduct"
                      defaultMessage="END PRODUCT"
                    />
                  </Label>
                  <OrderProductProviderCard
                    productProvider={originalValues.productProvider}
                    onClick={() =>
                      navigate(`/product/${encodeId(originalValues.productProvider.product.id)}`)
                    }
                  />
                  <Label>
                    <FormattedMessage id="modules.OrderItems.order" defaultMessage="ORDER" />
                  </Label>
                  <OrderCard
                    order={originalValues.order}
                    onClick={() => navigate(`/order/${encodeId(originalValues.order.id)}`)}
                  />
                </GridColumn>
              </div>
            </>
          );
        }}
      </Subscribe>
    </div>
  );
};

export default ItemSection;
