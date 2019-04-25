import React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Subscribe } from 'unstated';
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
import { OrderItemInfoContainer } from 'modules/orderItem/form/containers';
import validator from 'modules/orderItem/form/validator';

import { ItemSectionWrapperStyle, MainFieldsWrapperStyle, DividerStyle } from './style';
import OrderItemSummaryChart from './components/OrderItemSummaryChart';

const ItemSection = () => (
  <div className={ItemSectionWrapperStyle}>
    <Subscribe to={[OrderItemInfoContainer]}>
      {({ originalValues, state, setFieldValue, setDeepFieldValue }) => {
        const values = { ...originalValues, ...state };

        const { batches, price, quantity } = values;
        const { orderedQuantity, batchedQuantity, shippedQuantity } = getItemQuantityChartData({
          orderItem: values,
          batches,
        });

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
                        <FormattedMessage id="module.orderItem.itemNO" defaultMessage="ITEM NO" />
                      }
                      editable
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
                          id="module.orderItem.quantity"
                          defaultMessage="QUANTITY"
                        />
                      }
                      editable
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
                          id="module.orderItem.unitPrice"
                          defaultMessage="UNIT PRICE"
                        />
                      }
                      suffix={getByPathWithDefault('', 'order.currency', values)}
                      editable
                    />
                  )}
                </FormField>

                <CustomFieldsFactory
                  entityType="OrderItem"
                  customFields={values.customFields}
                  setFieldValue={setFieldValue}
                  editable={{
                    values: true,
                    mask: true,
                  }}
                />

                <FieldItem
                  vertical
                  label={
                    <Label height="30px">
                      <FormattedMessage id="modules.orderItem.tags" defaultMessage="TAGS" />
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
                        set: true,
                        remove: true,
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
                      label={<FormattedMessage id="modules.orderItem.memo" defaultMessage="MEMO" />}
                      editable
                      vertical
                      inputWidth="400px"
                      inputHeight="65px"
                    />
                  )}
                </FormField>

                <div className={DividerStyle} />

                <OrderItemSummaryChart
                  orderedQuantity={orderedQuantity}
                  batchedQuantity={batchedQuantity}
                  shippedQuantity={shippedQuantity}
                  totalPrice={totalPrice}
                />
              </GridColumn>

              <GridColumn>
                <Label>
                  <FormattedMessage
                    id="modules.orderItem.endProduct"
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
                  <FormattedMessage id="modules.orderItem.order" defaultMessage="ORDER" />
                </Label>
                <OrderCard order={originalValues.order} />
              </GridColumn>
            </div>
          </>
        );
      }}
    </Subscribe>
  </div>
);

export default ItemSection;
