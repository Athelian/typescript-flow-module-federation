// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { encodeId } from 'utils/id';
import { CloneButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { TAG_LIST } from 'modules/permission/constants/tag';
import { ORDER_ITEMS_LIST, ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/order';
import {
  BATCH_CREATE,
  BATCH_UPDATE,
  BATCH_SET_NO,
  BATCH_SET_QUANTITY,
  BATCH_SET_DELIVERY_DATE,
  BATCH_SET_DESIRED_DATE,
  BATCH_SET_EXPIRY,
  BATCH_SET_PRODUCTION_DATE,
  BATCH_SET_CUSTOM_FIELDS,
  BATCH_SET_TAGS,
  BATCH_SET_MEMO,
  BATCH_SET_ORDER_ITEM,
  BATCH_SET_CUSTOM_FIELDS_MASK,
} from 'modules/permission/constants/batch';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import SlideView from 'components/SlideView';
import BatchFormContainer from 'modules/batch/form/containers';
import validator from 'modules/batch/form/validator';
import { FormField, FormContainer } from 'modules/form';
import { OrderItemCard, GrayCard } from 'components/Cards';
import { totalAdjustQuantity } from 'components/Cards/utils';
import GridColumn from 'components/GridColumn';
import {
  SectionHeader,
  LastModified,
  FormTooltip,
  SectionWrapper,
  FieldItem,
  Label,
  DashedPlusButton,
  TagsInput,
  CustomFieldsFactory,
  TextInputFactory,
  NumberInputFactory,
  DateInputFactory,
  TextAreaInputFactory,
} from 'components/Form';
import messages from 'modules/batch/messages';
import SelectOrderItem from 'modules/batch/common/SelectOrderItem';
import {
  StatusStyle,
  StatusLabelStyle,
  BatchSectionWrapperStyle,
  MainFieldsWrapperStyle,
  ItemSectionStyle,
  DividerStyle,
} from './style';

type Props = {
  isNew: boolean,
  isClone: boolean,
  selectable: boolean,
  batch: Object,
};

const BatchSection = ({ isNew, isClone, selectable, batch }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const allowUpdate = hasPermission(BATCH_UPDATE);

  return (
    <SectionWrapper id="batch_batchSection">
      <SectionHeader
        icon="BATCH"
        title={<FormattedMessage id="modules.Batches.batch" defaultMessage="BATCH" />}
      >
        {!isNew && (
          <>
            <LastModified updatedAt={batch.updatedAt} updatedBy={batch.updatedBy} />

            <div className={StatusStyle(batch.archived)}>
              <Icon icon={batch.archived ? 'ARCHIVED' : 'ACTIVE'} />
              <div className={StatusLabelStyle}>
                {batch.archived ? (
                  <FormattedMessage id="modules.Batches.archived" defaultMessage="Archived" />
                ) : (
                  <FormattedMessage id="modules.Batches.active" defaultMessage="Active" />
                )}
              </div>
              <FormTooltip
                infoMessage={
                  <FormattedMessage
                    id="modules.Batches.archived.tooltip.infoMessage"
                    defaultMessage="The status is controlled by the Order and Shipment this Batch belongs to"
                  />
                }
                position="bottom"
              />
            </div>

            {!isClone && hasPermission(BATCH_CREATE) && (
              <CloneButton onClick={() => navigate(`/batch/clone/${encodeId(batch.id)}`)} />
            )}
          </>
        )}
      </SectionHeader>
      <div className={BatchSectionWrapperStyle}>
        <Subscribe to={[BatchFormContainer]}>
          {({ originalValues: initialValues, state, setFieldValue, calculatePackageQuantity }) => {
            const values = { ...initialValues, ...state };
            const { batchAdjustments = [] } = values;
            const totalAdjustment = totalAdjustQuantity(batchAdjustments);

            return (
              <>
                <div className={MainFieldsWrapperStyle}>
                  <GridColumn>
                    <FormField
                      name="no"
                      initValue={values.no}
                      setFieldValue={setFieldValue}
                      validator={validator}
                      values={values}
                    >
                      {({ name, ...inputHandlers }) => (
                        <TextInputFactory
                          name={name}
                          {...inputHandlers}
                          isNew={isNew}
                          required
                          originalValue={initialValues[name]}
                          label={<FormattedMessage {...messages.batchNo} />}
                          editable={allowUpdate || hasPermission(BATCH_SET_NO)}
                        />
                      )}
                    </FormField>

                    <FormField
                      name="quantity"
                      initValue={values.quantity + totalAdjustment}
                      setFieldValue={setFieldValue}
                      values={values}
                      validator={validator}
                    >
                      {({ name, ...inputHandlers }) => (
                        <Subscribe to={[FormContainer]}>
                          {({ setFieldTouched }) => (
                            <NumberInputFactory
                              name={name}
                              {...inputHandlers}
                              onBlur={evt => {
                                inputHandlers.onBlur(evt);
                                setFieldValue('quantity', inputHandlers.value - totalAdjustment);
                                calculatePackageQuantity(setFieldTouched);
                              }}
                              isNew={isNew}
                              required
                              originalValue={initialValues[name] + totalAdjustment}
                              label={<FormattedMessage {...messages.quantity} />}
                              editable={allowUpdate || hasPermission(BATCH_SET_QUANTITY)}
                            />
                          )}
                        </Subscribe>
                      )}
                    </FormField>

                    <FormField
                      name="deliveredAt"
                      initValue={values.deliveredAt}
                      setFieldValue={setFieldValue}
                      values={values}
                      validator={validator}
                    >
                      {({ name, ...inputHandlers }) => (
                        <DateInputFactory
                          name={name}
                          {...inputHandlers}
                          isNew={isNew}
                          originalValue={initialValues[name]}
                          label={<FormattedMessage {...messages.deliveredAt} />}
                          editable={allowUpdate || hasPermission(BATCH_SET_DELIVERY_DATE)}
                        />
                      )}
                    </FormField>

                    <FormField
                      name="desiredAt"
                      initValue={values.desiredAt}
                      setFieldValue={setFieldValue}
                      values={values}
                      validator={validator}
                    >
                      {({ name, ...inputHandlers }) => (
                        <DateInputFactory
                          name={name}
                          {...inputHandlers}
                          isNew={isNew}
                          originalValue={initialValues[name]}
                          label={<FormattedMessage {...messages.desiredAt} />}
                          editable={allowUpdate || hasPermission(BATCH_SET_DESIRED_DATE)}
                        />
                      )}
                    </FormField>

                    <FormField
                      name="expiredAt"
                      initValue={values.expiredAt}
                      setFieldValue={setFieldValue}
                      values={values}
                      validator={validator}
                    >
                      {({ name, ...inputHandlers }) => (
                        <DateInputFactory
                          name={name}
                          {...inputHandlers}
                          isNew={isNew}
                          originalValue={initialValues[name]}
                          label={<FormattedMessage {...messages.expiredAt} />}
                          editable={allowUpdate || hasPermission(BATCH_SET_EXPIRY)}
                        />
                      )}
                    </FormField>

                    <FormField
                      name="producedAt"
                      initValue={values.producedAt}
                      setFieldValue={setFieldValue}
                      values={values}
                      validator={validator}
                    >
                      {({ name, ...inputHandlers }) => (
                        <DateInputFactory
                          name={name}
                          {...inputHandlers}
                          isNew={isNew}
                          originalValue={initialValues[name]}
                          label={<FormattedMessage {...messages.producedAt} />}
                          editable={allowUpdate || hasPermission(BATCH_SET_PRODUCTION_DATE)}
                        />
                      )}
                    </FormField>
                    <CustomFieldsFactory
                      entityType="Batch"
                      customFields={values.customFields}
                      setFieldValue={setFieldValue}
                      editable={{
                        values: allowUpdate || hasPermission(BATCH_SET_CUSTOM_FIELDS),
                        mask: allowUpdate || hasPermission(BATCH_SET_CUSTOM_FIELDS_MASK),
                      }}
                    />
                  </GridColumn>
                  <div className={ItemSectionStyle}>
                    <Label required>
                      <FormattedMessage {...messages.orderItem} />
                    </Label>
                    {(allowUpdate || hasPermission(BATCH_SET_ORDER_ITEM)) &&
                    hasPermission(ORDER_ITEMS_LIST) ? (
                      <BooleanValue>
                        {({ value: opened, set: slideToggle }) => (
                          <React.Fragment>
                            {!values.orderItem ? (
                              <DashedPlusButton
                                data-testid="selectOrderItemButton"
                                width="195px"
                                height="217px"
                                onClick={() => slideToggle(true)}
                              />
                            ) : (
                              <OrderItemCard
                                viewPrice={hasPermission(ORDER_ITEMS_GET_PRICE)}
                                selectable
                                item={values.orderItem}
                                onSelect={selectable ? () => slideToggle(true) : null}
                              />
                            )}

                            <SlideView
                              isOpen={opened}
                              onRequestClose={() => slideToggle(false)}
                              options={{ width: '1030px' }}
                            >
                              {opened && (
                                <SelectOrderItem
                                  selected={values.orderItem}
                                  onCancel={() => slideToggle(false)}
                                  onSelect={newValue => {
                                    slideToggle(false);
                                    setFieldValue('orderItem', newValue);
                                    const {
                                      productProvider: {
                                        packageName,
                                        packageCapacity,
                                        packageGrossWeight,
                                        packageVolume,
                                        packageSize,
                                      },
                                    } = newValue;
                                    setFieldValue('packageName', packageName);
                                    setFieldValue('packageCapacity', packageCapacity);
                                    setFieldValue('packageGrossWeight', packageGrossWeight);
                                    setFieldValue('packageVolume', packageVolume);
                                    setFieldValue('packageSize', packageSize);
                                  }}
                                />
                              )}
                            </SlideView>
                          </React.Fragment>
                        )}
                      </BooleanValue>
                    ) : (
                      <>
                        {values.orderItem ? (
                          <OrderItemCard
                            viewPrice={hasPermission(ORDER_ITEMS_GET_PRICE)}
                            selectable
                            item={values.orderItem}
                            readOnly
                          />
                        ) : (
                          <GrayCard width="195px" height="215px" />
                        )}
                      </>
                    )}
                  </div>
                </div>
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
                      tagType="Batch"
                      values={values.tags}
                      onChange={(field, value) => {
                        setFieldValue(field, value);
                      }}
                      editable={{
                        set:
                          hasPermission(TAG_LIST) && hasPermission([BATCH_UPDATE, BATCH_SET_TAGS]),
                        remove: hasPermission([BATCH_UPDATE, BATCH_SET_TAGS]),
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
                      isNew={isNew}
                      originalValue={initialValues[name]}
                      label={<FormattedMessage {...messages.memo} />}
                      editable={allowUpdate || hasPermission(BATCH_SET_MEMO)}
                      vertical
                      inputWidth="680px"
                      inputHeight="65px"
                    />
                  )}
                </FormField>

                <div className={DividerStyle} />
              </>
            );
          }}
        </Subscribe>
      </div>
    </SectionWrapper>
  );
};

export default BatchSection;
