// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue, StringValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import usePermission from 'hooks/usePermission';
import { spanWithColor } from 'utils/color';
import {
  OrderInfoContainer,
  OrderTagsContainer,
  OrderItemsContainer,
} from 'modules/order/form/containers';
import validator from 'modules/order/form/validator';
import { FormField } from 'modules/form';
import SlideView from 'components/SlideView';
import GridColumn from 'components/GridColumn';
import {
  FieldItem,
  Label,
  DashedPlusButton,
  TagsInput,
  TextInputFactory,
  TextAreaInputFactory,
  DateInputFactory,
  CustomFieldsFactory,
  EnumSearchSelectInputFactory,
  UserAssignmentInputFactory,
} from 'components/Form';
import { getQuantitySummary } from 'modules/order/helpers';
import { ORDER_UPDATE, ORDER_SET_TAGS } from 'modules/permission/constants/order';
import messages from 'modules/order/messages';
import SelectExporters from 'modules/order/common/SelectExporters';
import { PartnerCard, GrayCard } from 'components/Cards';
import { TAG_LIST } from 'modules/permission/constants/tag';
import TotalSummary from './components/TotalSummary';
import PriceDialog from './components/PriceDialog';
import {
  OrderSectionWrapperStyle,
  MainFieldsWrapperStyle,
  QuantitySummaryStyle,
  DividerStyle,
  DialogLineStyle,
} from './style';

type Props = {
  isNew: boolean,
};

const OrderSection = ({ isNew }: Props) => {
  const { hasPermission } = usePermission();
  const allowUpdate = hasPermission(ORDER_UPDATE);

  return (
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
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        name={name}
                        {...inputHandlers}
                        isNew={isNew}
                        required
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.PO} />}
                        editable={allowUpdate}
                      />
                    )}
                  </FormField>
                  <FormField
                    name="piNo"
                    initValue={values.piNo}
                    values={values}
                    validator={validator}
                    setFieldValue={setFieldValue}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        name={name}
                        {...inputHandlers}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.PI} />}
                        editable={allowUpdate}
                      />
                    )}
                  </FormField>
                  <FormField
                    name="issuedAt"
                    initValue={values.issuedAt}
                    values={values}
                    validator={validator}
                    setFieldValue={setFieldValue}
                  >
                    {({ name, ...inputHandlers }) => (
                      <DateInputFactory
                        name={name}
                        {...inputHandlers}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.date} />}
                        editable={allowUpdate}
                      />
                    )}
                  </FormField>
                  <BooleanValue>
                    {({ value: isOpen, set: setPriceDialog }) => (
                      <Subscribe to={[OrderItemsContainer]}>
                        {({ state: { orderItems }, setFieldValue: setItemFieldValue }) => (
                          <StringValue>
                            {({ value: previousCurrency, set: setPreviousCurrency }) => (
                              <>
                                <PriceDialog
                                  isOpen={isOpen}
                                  onRequestClose={() => {
                                    setFieldValue(
                                      'currency',
                                      previousCurrency || initialValues.currency
                                    );
                                    setPriceDialog(false);
                                  }}
                                  onConfirm={() => {
                                    setItemFieldValue(
                                      'orderItems',
                                      orderItems.map(orderItem => ({
                                        ...orderItem,
                                        price: {
                                          ...orderItem.price,
                                          amount: 0,
                                        },
                                      }))
                                    );
                                    setPreviousCurrency(values.currency);
                                    setPriceDialog(false);
                                  }}
                                  onCancel={() => {
                                    setFieldValue(
                                      'currency',
                                      previousCurrency || initialValues.currency
                                    );
                                    setPriceDialog(false);
                                  }}
                                  onDeny={() => {
                                    setPriceDialog(false);
                                    setPreviousCurrency(values.currency);
                                  }}
                                  message={
                                    <>
                                      <div className={DialogLineStyle}>
                                        <FormattedMessage
                                          {...messages.detectPriceChanged}
                                          values={{
                                            items: spanWithColor(
                                              <FormattedMessage {...messages.sectionItems} />,
                                              'ORDER_ITEM'
                                            ),
                                          }}
                                        />
                                      </div>
                                      <div className={DialogLineStyle}>
                                        <FormattedMessage
                                          {...messages.changePrice}
                                          values={{
                                            items: spanWithColor(
                                              <FormattedMessage {...messages.sectionItems} />,
                                              'ORDER_ITEM'
                                            ),
                                          }}
                                        />
                                      </div>
                                      <div className={DialogLineStyle}>
                                        <FormattedMessage {...messages.resetPrice} />
                                      </div>
                                    </>
                                  }
                                />

                                <FormField
                                  name="currency"
                                  initValue={values.currency}
                                  values={values}
                                  validator={validator}
                                  setFieldValue={setFieldValue}
                                >
                                  {({ name, onBlur, ...inputHandlers }) => (
                                    <EnumSearchSelectInputFactory
                                      name={name}
                                      {...inputHandlers}
                                      isNew={isNew}
                                      originalValue={initialValues[name]}
                                      label={<FormattedMessage {...messages.currency} />}
                                      editable={allowUpdate}
                                      enumType="Currency"
                                      required
                                      onBlur={value => {
                                        onBlur();
                                        if (value !== values.currency && orderItems.length > 0) {
                                          setPriceDialog(true);
                                        } else {
                                          setPreviousCurrency(value);
                                        }
                                      }}
                                      hideClearButton
                                    />
                                  )}
                                </FormField>
                              </>
                            )}
                          </StringValue>
                        )}
                      </Subscribe>
                    )}
                  </BooleanValue>
                  <FormField
                    name="incoterm"
                    initValue={values.incoterm}
                    values={values}
                    validator={validator}
                    setFieldValue={setFieldValue}
                  >
                    {({ name, ...inputHandlers }) => (
                      <EnumSearchSelectInputFactory
                        name={name}
                        {...inputHandlers}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.incoterm} />}
                        editable={allowUpdate}
                        enumType="Incoterm"
                      />
                    )}
                  </FormField>
                  <FormField
                    name="deliveryPlace"
                    initValue={values.deliveryPlace}
                    values={values}
                    validator={validator}
                    setFieldValue={setFieldValue}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        name={name}
                        {...inputHandlers}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.deliveryPlace} />}
                        editable={allowUpdate}
                      />
                    )}
                  </FormField>
                  <CustomFieldsFactory
                    entityType="Order"
                    customFields={values.customFields}
                    setFieldValue={setFieldValue}
                    editable={allowUpdate}
                  />
                </GridColumn>

                <GridColumn gap="10px">
                  <UserAssignmentInputFactory
                    name="inCharges"
                    values={values.inCharges}
                    onChange={(name: string, assignments: Array<Object>) =>
                      setFieldValue(name, assignments)
                    }
                    label={
                      <>
                        <FormattedMessage
                          id="components.inputs.inCharge"
                          defaultMessage="IN CHARGE"
                        />
                        {' ('}
                        <FormattedNumber value={values.inCharges.length} />
                        {')'}
                      </>
                    }
                    infoMessage={
                      <FormattedMessage
                        id="modules.Orders.inChargeExplanation"
                        defaultMessage="You can choose up to 5 people in charge."
                      />
                    }
                    editable={allowUpdate}
                  />

                  <Label required>
                    <FormattedMessage {...messages.exporter} />
                  </Label>

                  {allowUpdate ? (
                    <BooleanValue>
                      {({ value: opened, set: slideToggle }) => (
                        <>
                          {!values.exporter ? (
                            <DashedPlusButton
                              width="195px"
                              height="215px"
                              onClick={() => slideToggle(true)}
                            />
                          ) : (
                            <PartnerCard
                              partner={values.exporter}
                              onClick={() => slideToggle(true)}
                            />
                          )}

                          <SlideView
                            isOpen={opened}
                            onRequestClose={() => slideToggle(false)}
                            options={{ width: '1030px' }}
                          >
                            {opened && (
                              <Subscribe to={[OrderItemsContainer]}>
                                {({ setFieldValue: resetOrderItems }) => (
                                  <SelectExporters
                                    selected={values.exporter}
                                    onCancel={() => slideToggle(false)}
                                    onSelect={newValue => {
                                      slideToggle(false);
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
                  ) : (
                    <>
                      {values.exporter ? (
                        <PartnerCard partner={values.exporter} />
                      ) : (
                        <GrayCard width="195px" height="215px" />
                      )}
                    </>
                  )}
                </GridColumn>
              </div>

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
                        id="tags"
                        name="tags"
                        tagType="Order"
                        values={tags}
                        onChange={(field, value) => {
                          changeTags(field, value);
                        }}
                        editable={{
                          set:
                            hasPermission(TAG_LIST) &&
                            hasPermission([ORDER_UPDATE, ORDER_SET_TAGS]),
                          remove: hasPermission([ORDER_UPDATE, ORDER_SET_TAGS]),
                        }}
                      />
                    }
                  />
                )}
              </Subscribe>

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
                    isNew={isNew}
                    originalValue={initialValues[name]}
                    label={<FormattedMessage {...messages.memo} />}
                    editable={allowUpdate}
                    vertical
                    inputWidth="680px"
                    inputHeight="65px"
                  />
                )}
              </FormField>

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
};

export default OrderSection;
