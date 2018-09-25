// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import {
  OrderInfoContainer,
  OrderTagsContainer,
  OrderItemsContainer,
} from 'modules/order/form/containers';
import validator from 'modules/order/form/validator';
import { FormField } from 'modules/form';
import SlideView from 'components/SlideView';
import GridColumn from 'components/GridColumn';
import { FieldItem, Label, DashedPlusButton, TagsInput } from 'components/Form';
import {
  textInputFactory,
  dateInputFactory,
  selectSearchEnumInputFactory,
} from 'modules/form/helpers';
import BaseCard from 'components/Cards';
import messages from 'modules/order/messages';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import SelectExporters from '../SelectExporters';
import TotalSummary from './components/TotalSummary';
import {
  OrderSectionWrapperStyle,
  MainFieldsWrapperStyle,
  ExporterSectionStyle,
  ExporterCardStyle,
  ExporterCardImageStyle,
  ExporterNameStyle,
  TagsInputStyle,
  QuantitySummaryStyle,
  DividerStyle,
} from './style';

type Props = {
  isNew: boolean,
};

function getQuantitySummary(orderItems: any) {
  let orderedQuantity = 0;
  let batchedQuantity = 0;
  let shippedQuantity = 0;
  let totalPrice = 0;
  let totalItems = 0;
  let activeBatches = 0;
  let archivedBatches = 0;

  if (orderItems) {
    totalItems = orderItems.length;

    orderItems.forEach(item => {
      const qty = item.quantity ? item.quantity : 0;
      const price = item.price ? item.price.amount : 0;
      orderedQuantity += qty;
      totalPrice += price * qty;

      if (item.batches) {
        item.batches.forEach(batch => {
          batchedQuantity += batch.quantity;
          if (batch.batchAdjustments) {
            batch.batchAdjustments.forEach(batchAdjustment => {
              batchedQuantity -= batchAdjustment.quantity;
            });
          }
          if (batch.shipment) {
            shippedQuantity += batch.quantity;
          }
          if (batch.archived) {
            archivedBatches += 1;
          } else {
            activeBatches += 1;
          }
        });
      }
    });
  }

  return {
    orderedQuantity,
    batchedQuantity,
    shippedQuantity,
    totalPrice,
    totalItems,
    activeBatches,
    archivedBatches,
  };
}
const OrderSection = ({ isNew }: Props) => (
  <div className={OrderSectionWrapperStyle}>
    <Subscribe to={[OrderInfoContainer]}>
      {({ originalValues: initialValues, state, setFieldValue }) => {
        const values = { ...initialValues, ...state };
        const { currency } = values;

        return (
          <>
            <div className={MainFieldsWrapperStyle}>
              <GridColumn>
                <FormField
                  name="poNo"
                  initValue={values.poNo}
                  values={values}
                  validator={validator}
                  setFieldValue={setFieldValue}
                >
                  {({ name, ...inputHandlers }) =>
                    textInputFactory({
                      inputHandlers,
                      name,
                      isNew,
                      required: true,
                      initValue: initialValues[name],
                      label: <FormattedMessage {...messages.PO} />,
                    })
                  }
                </FormField>
                <FormField
                  name="piNo"
                  initValue={values.piNo}
                  values={values}
                  validator={validator}
                  setFieldValue={setFieldValue}
                >
                  {({ name, ...inputHandlers }) =>
                    textInputFactory({
                      name,
                      inputHandlers,
                      isNew,
                      initValue: initialValues[name],
                      label: <FormattedMessage {...messages.PI} />,
                    })
                  }
                </FormField>
                <FormField
                  name="issuedAt"
                  initValue={values.issuedAt}
                  values={values}
                  validator={validator}
                  setFieldValue={setFieldValue}
                >
                  {({ name, ...inputHandlers }) =>
                    dateInputFactory({
                      name,
                      inputHandlers,
                      isNew,
                      initValue: initialValues[name],
                      label: <FormattedMessage {...messages.date} />,
                    })
                  }
                </FormField>
                <FormField
                  name="currency"
                  initValue={values.currency}
                  values={values}
                  validator={validator}
                  setFieldValue={(field, { name }) => setFieldValue(field, name)}
                >
                  {({ name, ...inputHandlers }) =>
                    selectSearchEnumInputFactory({
                      required: true,
                      enumType: 'Currency',
                      name,
                      inputHandlers,
                      isNew,
                      initValue: initialValues[name],
                      label: <FormattedMessage {...messages.currency} />,
                    })
                  }
                </FormField>
                <FormField
                  name="incoterm"
                  initValue={values.incoterm}
                  values={values}
                  validator={validator}
                  setFieldValue={(field, { name }) => setFieldValue(field, name)}
                >
                  {({ name, ...inputHandlers }) =>
                    selectSearchEnumInputFactory({
                      enumType: 'Incoterm',
                      name,
                      inputHandlers,
                      isNew,
                      initValue: initialValues[name],
                      label: <FormattedMessage {...messages.incoterm} />,
                    })
                  }
                </FormField>
                <FormField
                  name="deliveryPlace"
                  initValue={values.deliveryPlace}
                  values={values}
                  validator={validator}
                  setFieldValue={setFieldValue}
                >
                  {({ name, ...inputHandlers }) =>
                    textInputFactory({
                      name,
                      inputHandlers,
                      isNew,
                      initValue: initialValues[name],
                      label: <FormattedMessage {...messages.deliveryPlace} />,
                    })
                  }
                </FormField>
              </GridColumn>

              <div className={ExporterSectionStyle}>
                <Label required>
                  <FormattedMessage {...messages.exporter} />
                </Label>
                <BooleanValue>
                  {({ value: opened, toggle }) => (
                    <>
                      {!values.exporter ? (
                        <DashedPlusButton width="200px" height="230px" onClick={toggle} />
                      ) : (
                        <BaseCard icon="PARTNER" color="PARTNER">
                          <div className={ExporterCardStyle} role="presentation" onClick={toggle}>
                            <img
                              className={ExporterCardImageStyle}
                              src={FALLBACK_IMAGE}
                              alt="exporter_image"
                            />
                            <div className={ExporterNameStyle}>
                              {values.exporter && values.exporter.id
                                ? values.exporter.name
                                : 'Exporter'}
                            </div>
                          </div>
                        </BaseCard>
                      )}

                      <SlideView
                        isOpen={opened}
                        onRequestClose={toggle}
                        options={{ width: '1030px' }}
                      >
                        {opened && (
                          <Subscribe to={[OrderItemsContainer]}>
                            {({ setFieldValue: resetOrderItems }) => (
                              <SelectExporters
                                selected={values.exporter}
                                onCancel={toggle}
                                onSelect={newValue => {
                                  toggle();
                                  setFieldValue('exporter', newValue);
                                  resetOrderItems('orderItems', []);
                                }}
                              />
                            )}
                          </Subscribe>
                        )}
                      </SlideView>
                    </>
                  )}
                </BooleanValue>
              </div>
            </div>
            <div className={TagsInputStyle}>
              <Subscribe to={[OrderTagsContainer]}>
                {({ state: { tags }, setFieldValue: changeTags }) => (
                  <FieldItem
                    vertical
                    label={
                      <Label>
                        <FormattedMessage {...messages.tags} />
                      </Label>
                    }
                    input={
                      <TagsInput
                        editable={isNew}
                        id="tags"
                        name="tags"
                        tagType="Order"
                        values={tags}
                        onChange={(field, value) => {
                          changeTags(field, value);
                        }}
                      />
                    }
                  />
                )}
              </Subscribe>
            </div>
            <div className={DividerStyle} />
            <Subscribe to={[OrderItemsContainer]}>
              {({ state: { orderItems } }) => {
                const {
                  orderedQuantity,
                  batchedQuantity,
                  shippedQuantity,
                  totalPrice,
                  totalItems,
                  activeBatches,
                  archivedBatches,
                } = getQuantitySummary(orderItems);
                return (
                  <div className={QuantitySummaryStyle}>
                    <TotalSummary
                      orderedQuantity={orderedQuantity}
                      batchedQuantity={batchedQuantity}
                      shippedQuantity={shippedQuantity}
                      currency={currency}
                      totalPrice={totalPrice}
                      totalItems={totalItems}
                      activeBatches={activeBatches}
                      archivedBatches={archivedBatches}
                    />
                  </div>
                );
              }}
            </Subscribe>
          </>
        );
      }}
    </Subscribe>
  </div>
);

export default OrderSection;
