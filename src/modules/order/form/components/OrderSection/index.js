// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { navigate } from '@reach/router';
import { BooleanValue, StringValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import { encodeId } from 'utils/id';
import { getByPath } from 'utils/fp';
import FormattedNumber from 'components/FormattedNumber';
import { CloneButton } from 'components/Buttons';
import { OrderActivateDialog, OrderArchiveDialog } from 'modules/order/common/Dialog';
import MainSectionPlaceholder from 'components/PlaceHolder/MainSectionPlaceHolder';
import usePartnerPermission from 'hooks/usePartnerPermission';
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
  SectionHeader,
  LastModified,
  StatusToggle,
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
import {
  ORDER_UPDATE,
  ORDER_SET_PO_NO,
  ORDER_SET_PI_NO,
  ORDER_SET_CURRENCY,
  ORDER_SET_DELIVERY_PLACE,
  ORDER_SET_ISSUE_AT,
  ORDER_SET_DELIVERY_DATE,
  ORDER_SET_CUSTOM_FIELDS,
  ORDER_SET_CUSTOM_FIELDS_MASK,
  ORDER_SET_MEMO,
  ORDER_SET_IN_CHARGES,
  ORDER_SET_IMPORTER,
  ORDER_SET_ARCHIVED,
  ORDER_CREATE,
} from 'modules/permission/constants/order';
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
  isLoading: boolean,
  order: Object,
};

const OrderSection = ({ isNew, isClone, order, isLoading }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const { updatedAt, updatedBy, archived } = order;
  return (
    <MainSectionPlaceholder height={866} isLoading={isLoading}>
      <SectionHeader
        icon="ORDER"
        title={<FormattedMessage id="modules.Orders.order" defaultMessage="ORDER" />}
      >
        {!isNew && (
          <>
            <LastModified updatedAt={updatedAt} updatedBy={updatedBy} />
            {!isClone && hasPermission([ORDER_CREATE]) && (
              <CloneButton onClick={() => navigate(`/order/clone/${encodeId(order.id)}`)} />
            )}
            <BooleanValue>
              {({ value: isDialogOpen, set: dialogToggle }) => (
                <StatusToggle
                  readOnly={!hasPermission(ORDER_UPDATE) && !hasPermission(ORDER_SET_ARCHIVED)}
                  archived={archived}
                  openStatusDialog={() => dialogToggle(true)}
                  activateDialog={
                    <OrderActivateDialog
                      order={order}
                      isOpen={isDialogOpen && !!archived}
                      onRequestClose={() => dialogToggle(false)}
                    />
                  }
                  archiveDialog={
                    <OrderArchiveDialog
                      order={order}
                      isOpen={isDialogOpen && !archived}
                      onRequestClose={() => dialogToggle(false)}
                    />
                  }
                />
              )}
            </BooleanValue>
          </>
        )}
      </SectionHeader>
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
                          editable={hasPermission([ORDER_UPDATE, ORDER_SET_PO_NO])}
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
                          editable={hasPermission([ORDER_UPDATE, ORDER_SET_PI_NO])}
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
                              editable={hasPermission([ORDER_UPDATE, ORDER_SET_ISSUE_AT])}
                            />
                          )}
                        </FormField>
                      )}
                    </Subscribe>

                    <Subscribe to={[OrderTasksContainer]}>
                      {taskContainer => (
                        <FormField
                          name="deliveryDate"
                          initValue={values.deliveryDate}
                          setFieldValue={setFieldValue}
                          values={values}
                          validator={validator}
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
                              originalValue={initialValues.deliveryDate}
                              label={<FormattedMessage {...messages.deliveryDate} />}
                              editable={hasPermission([ORDER_UPDATE, ORDER_SET_DELIVERY_DATE])}
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
                                        editable={hasPermission([ORDER_UPDATE, ORDER_SET_CURRENCY])}
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
                          editable={hasPermission([ORDER_UPDATE, ORDER_SET_CURRENCY])}
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
                          editable={hasPermission([ORDER_UPDATE, ORDER_SET_DELIVERY_PLACE])}
                        />
                      )}
                    </FormField>

                    <CustomFieldsFactory
                      entityType="Order"
                      customFields={values.customFields}
                      setFieldValue={setFieldValue}
                      editable={{
                        values: hasPermission([ORDER_UPDATE, ORDER_SET_CUSTOM_FIELDS]),
                        mask: hasPermission([ORDER_UPDATE, ORDER_SET_CUSTOM_FIELDS_MASK]),
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
                              onChange={value => {
                                changeTags('tags', value);
                              }}
                              onClickRemove={value => {
                                changeTags('tags', tags.filter(({ id }) => id !== value.id));
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
                          editable={hasPermission([ORDER_UPDATE, ORDER_SET_MEMO])}
                          vertical
                          inputWidth="400px"
                          inputHeight="120px"
                        />
                      )}
                    </FormField>
                  </GridColumn>

                  <GridColumn>
                    <UserAssignmentInputFactory
                      cacheKey="OrderUserSelect"
                      groupIds={[
                        getByPath('id', values.importer),
                        getByPath('id', values.exporter),
                      ].filter(Boolean)}
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
                      editable={hasPermission([ORDER_UPDATE, ORDER_SET_IN_CHARGES])}
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
                        hasPermission([ORDER_UPDATE, ORDER_SET_IMPORTER]) ? (
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
                                >
                                  {opened && (
                                    <Subscribe
                                      to={[
                                        OrderItemsContainer,
                                        OrderTasksContainer,
                                        OrderInfoContainer,
                                      ]}
                                    >
                                      {(
                                        { changeExporter: updateOrderItems },
                                        { changeExporter: updateTasks },
                                        { changeExporter: updateOrderInfo }
                                      ) => (
                                        <SelectExporter
                                          cacheKey="OrderSelectExporter"
                                          isRequired
                                          selected={values.exporter}
                                          onCancel={() => slideToggle(false)}
                                          onSelect={newValue => {
                                            slideToggle(false);
                                            setFieldValue('exporter', newValue);
                                            updateTasks(values.exporter);
                                            updateOrderInfo(values.exporter);
                                            updateOrderItems();
                                          }}
                                          warningMessage={
                                            <FormattedMessage
                                              id="modules.Orders.changeExporterWarning"
                                              defaultMessage="Changing the Exporter will remove all Items and Batches. It will also remove all assigned Staff of the current Exporter from all Tasks and In Charge. Are you sure you want to change the Exporter?"
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
    </MainSectionPlaceholder>
  );
};

export default OrderSection;
