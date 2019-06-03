// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue, StringValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import usePermission from 'hooks/usePermission';
import emitter from 'utils/emitter';
import { spanWithColor } from 'utils/color';
import {
  OrderInfoContainer,
  OrderTagsContainer,
  OrderItemsContainer,
  OrderTasksContainer,
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
import { getQuantityForOrderSummary } from 'modules/order/helpers';
import { ORDER_UPDATE } from 'modules/permission/constants/order';
import messages from 'modules/order/messages';
import SelectExporter from 'modules/order/common/SelectExporter';
import { PartnerCard, GrayCard } from 'components/Cards';
import { TAG_LIST } from 'modules/permission/constants/tag';
import OrderSummary from './components/OrderSummary';
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
  isClone: boolean,
};

const OrderSection = ({ isNew, isClone }: Props) => {
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

                  <Subscribe to={[OrderTasksContainer]}>
                    {taskContainer => (
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
                            onBlur={evt => {
                              inputHandlers.onBlur(evt);
                              emitter.emit('AUTO_DATE', name, inputHandlers.value);
                              if (!taskContainer.state.hasCalledTasksApiYet) {
                                taskContainer.waitForTasksSectionReady(name, inputHandlers.value);
                              }
                            }}
                            isNew={isNew}
                            originalValue={initialValues[name]}
                            label={<FormattedMessage {...messages.date} />}
                            editable={allowUpdate}
                          />
                        )}
                      </FormField>
                    )}
                  </Subscribe>

                  <BooleanValue>
                    {({ value: isOpen, set: setPriceDialog }) => (
                      <Subscribe to={[OrderItemsContainer]}>
                        {({
                          state: { orderItems, hasCalledItemsApiYet },
                          resetAmountWithNewCurrency,
                        }) => (
                          <StringValue>
                            {({ value: currentCurrency, set: changeCurrency }) => (
                              <>
                                <PriceDialog
                                  isOpen={isOpen}
                                  onRequestClose={() => {
                                    setFieldValue(
                                      'currency',
                                      currentCurrency || initialValues.currency
                                    );
                                    setPriceDialog(false);
                                  }}
                                  onConfirm={() => {
                                    resetAmountWithNewCurrency(values.currency);
                                    changeCurrency(values.currency);
                                    setPriceDialog(false);
                                  }}
                                  onCancel={() => {
                                    setFieldValue(
                                      'currency',
                                      currentCurrency || initialValues.currency
                                    );
                                    setPriceDialog(false);
                                  }}
                                  onDeny={() => {
                                    resetAmountWithNewCurrency(values.currency, false);
                                    changeCurrency(values.currency);
                                    setPriceDialog(false);
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
                                        if (
                                          value !== values.currency &&
                                          ((hasCalledItemsApiYet && orderItems.length) ||
                                            (!hasCalledItemsApiYet && values.orderItemCount))
                                        ) {
                                          setPriceDialog(true);
                                        } else {
                                          changeCurrency(value);
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
                    editable={{
                      values: allowUpdate,
                      mask: allowUpdate,
                    }}
                  />

                  <Subscribe to={[OrderTagsContainer]}>
                    {({ state: { tags }, setFieldValue: changeTags }) => (
                      <FieldItem
                        vertical
                        label={
                          <Label height="30px">
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
                              set: hasPermission(TAG_LIST) && hasPermission(ORDER_UPDATE),
                              remove: hasPermission(ORDER_UPDATE),
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
                        inputWidth="400px"
                        inputHeight="115px"
                      />
                    )}
                  </FormField>
                </GridColumn>

                <GridColumn>
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

                  <FieldItem
                    vertical
                    label={
                      <Label required>
                        <FormattedMessage {...messages.importer} />
                      </Label>
                    }
                    input={<PartnerCard partner={values.importer} readOnly />}
                  />

                  <FieldItem
                    vertical
                    label={
                      <Label required>
                        <FormattedMessage {...messages.exporter} />
                      </Label>
                    }
                    input={
                      allowUpdate ? (
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

                              <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                                {opened && (
                                  <Subscribe
                                    to={[
                                      OrderItemsContainer,
                                      OrderTasksContainer,
                                      OrderInfoContainer,
                                    ]}
                                  >
                                    {(
                                      { setFieldValue: updateOrderItems },
                                      { changeExporter: updateTasks },
                                      { changeExporter: updateOrderInfo }
                                    ) => (
                                      <SelectExporter
                                        selected={values.exporter}
                                        onCancel={() => slideToggle(false)}
                                        onSelect={newValue => {
                                          slideToggle(false);
                                          setFieldValue('exporter', newValue);
                                          updateTasks(values.exporter);
                                          updateOrderInfo(values.exporter);
                                          updateOrderItems('orderItems', []);
                                        }}
                                        warningMessage={
                                          <FormattedMessage
                                            id="modules.Orders.changeExporterWarning"
                                            defaultMessage="Changing the Exporter will remove all Items and Batches. It will also remove all assigned Staff of the current Export from all Tasks and In Charge. Are you sure you want to change the Exporter?"
                                          />
                                        }
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
                            <PartnerCard partner={values.exporter} readOnly />
                          ) : (
                            <GrayCard width="195px" height="215px" />
                          )}
                        </>
                      )
                    }
                  />
                </GridColumn>
              </div>

              <div className={DividerStyle} />

              <Subscribe to={[OrderItemsContainer]}>
                {({ state: { orderItems, hasCalledItemsApiYet } }) => {
                  return (
                    <div className={QuantitySummaryStyle}>
                      {hasCalledItemsApiYet || isClone ? (
                        <OrderSummary
                          currency={currency}
                          {...getQuantityForOrderSummary(orderItems)}
                        />
                      ) : (
                        <OrderSummary
                          currency={currency}
                          totalPrice={values.totalPrice && values.totalPrice.amount}
                          orderedQuantity={values.totalOrdered}
                          batchedQuantity={values.totalBatched}
                          shippedQuantity={values.totalShipped}
                          totalItems={values.orderItemCount}
                          totalBatches={values.batchCount}
                        />
                      )}
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
