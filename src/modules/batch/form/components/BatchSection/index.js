// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import emitter from 'utils/emitter';
import { encodeId } from 'utils/id';
import { CloneButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { TAG_LIST } from 'modules/permission/constants/tag';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { PRODUCT_FORM } from 'modules/permission/constants/product';
import { ORDER_ITEMS_LIST, ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import {
  BATCH_CREATE,
  BATCH_UPDATE,
  BATCH_SET_NO,
  BATCH_SET_DELIVERY_DATE,
  BATCH_SET_DESIRED_DATE,
  BATCH_SET_EXPIRY,
  BATCH_SET_PRODUCTION_DATE,
  BATCH_SET_CUSTOM_FIELDS,
  BATCH_SET_TAGS,
  BATCH_SET_MEMO,
  BATCH_SET_ORDER_ITEM,
  BATCH_SET_CUSTOM_FIELDS_MASK,
  BATCH_SET_PACKAGE_NAME,
  BATCH_SET_PACKAGE_CAPACITY,
  BATCH_SET_PACKAGE_WEIGHT,
  BATCH_SET_PACKAGE_VOLUME,
  BATCH_SET_PACKAGE_SIZE,
} from 'modules/permission/constants/batch';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import SlideView from 'components/SlideView';
import BatchFormContainer from 'modules/batch/form/containers';
import validator from 'modules/batch/form/validator';
import { FormField } from 'modules/form';
import { ItemCard } from 'components/Cards';

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
  batch: Object,
};

const BatchSection = ({ isNew, isClone, batch }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  return (
    <SectionWrapper id="batch_batchSection">
      <SectionHeader
        icon="BATCH"
        title={<FormattedMessage id="modules.Batches.batch" defaultMessage="BATCH" />}
      >
        {batch.updatedAt && (
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
          {({ originalValues: initialValues, state, setFieldValue }) => {
            const values = { ...initialValues, ...state };

            const { orderItem } = values;
            let compiledOrderItem = null;
            let compiledProductProvider = null;
            let compiledProduct = null;
            let compiledOrder = null;

            if (orderItem) {
              const {
                id,
                archived,
                no,
                quantity,
                price,
                tags,
                totalBatched,
                totalShipped,
                batchCount,
                batchShippedCount,
                productProvider,
                order,
                todo,
              } = orderItem;
              const { name: productProviderName, product } = productProvider;
              compiledProductProvider = { name: productProviderName };

              const {
                id: productId,
                name: productName,
                serial,
                tags: productTags,
                files,
              } = product;
              compiledProduct = {
                id: productId,
                name: productName,
                serial,
                tags: productTags,
                files,
              };

              compiledOrderItem = {
                id,
                archived,
                no,
                quantity,
                price,
                tags,
                totalBatched,
                totalShipped,
                batchCount,
                batchShippedCount,
                todo,
              };

              const { id: orderId, poNo } = order;
              compiledOrder = {
                id: orderId,
                poNo,
              };
            }

            const editable = {
              no: false,
              quantity: false,
              price: false,
            };

            const viewable = {
              price: hasPermission(ORDER_ITEMS_GET_PRICE),
            };

            const navigable = {
              order: hasPermission(ORDER_FORM),
              product: hasPermission(PRODUCT_FORM),
            };

            const config = {
              hideOrder: false,
            };

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
                          editable={hasPermission([BATCH_UPDATE, BATCH_SET_NO])}
                        />
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
                          onBlur={evt => {
                            inputHandlers.onBlur(evt);
                            emitter.emit('AUTO_DATE', name, inputHandlers.value);
                          }}
                          isNew={isNew}
                          originalValue={initialValues[name]}
                          label={<FormattedMessage {...messages.deliveredAt} />}
                          editable={hasPermission([BATCH_UPDATE, BATCH_SET_DELIVERY_DATE])}
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
                          onBlur={evt => {
                            inputHandlers.onBlur(evt);
                            emitter.emit('AUTO_DATE', name, inputHandlers.value);
                          }}
                          isNew={isNew}
                          originalValue={initialValues[name]}
                          label={<FormattedMessage {...messages.desiredAt} />}
                          editable={hasPermission([BATCH_UPDATE, BATCH_SET_DESIRED_DATE])}
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
                          onBlur={evt => {
                            inputHandlers.onBlur(evt);
                            emitter.emit('AUTO_DATE', name, inputHandlers.value);
                          }}
                          isNew={isNew}
                          originalValue={initialValues[name]}
                          label={<FormattedMessage {...messages.expiredAt} />}
                          editable={hasPermission([BATCH_UPDATE, BATCH_SET_EXPIRY])}
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
                          onBlur={evt => {
                            inputHandlers.onBlur(evt);
                            emitter.emit('AUTO_DATE', name, inputHandlers.value);
                          }}
                          isNew={isNew}
                          originalValue={initialValues[name]}
                          label={<FormattedMessage {...messages.producedAt} />}
                          editable={hasPermission([BATCH_UPDATE, BATCH_SET_PRODUCTION_DATE])}
                        />
                      )}
                    </FormField>
                    <CustomFieldsFactory
                      entityType="Batch"
                      customFields={values.customFields}
                      setFieldValue={setFieldValue}
                      editable={{
                        values: hasPermission([BATCH_UPDATE, BATCH_SET_CUSTOM_FIELDS]),
                        mask: hasPermission([BATCH_UPDATE, BATCH_SET_CUSTOM_FIELDS_MASK]),
                      }}
                    />
                  </GridColumn>
                  <div className={ItemSectionStyle}>
                    <Label required>
                      <FormattedMessage {...messages.orderItem} />
                    </Label>
                    {isNew &&
                    hasPermission([BATCH_UPDATE, BATCH_SET_ORDER_ITEM]) &&
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
                              <ItemCard
                                orderItem={compiledOrderItem}
                                productProvider={compiledProductProvider}
                                product={compiledProduct}
                                order={compiledOrder}
                                editable={editable}
                                viewable={viewable}
                                navigable={navigable}
                                config={config}
                                onClick={() => slideToggle(true)}
                              />
                            )}

                            <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                              {opened && (
                                <SelectOrderItem
                                  selected={values.orderItem}
                                  onCancel={() => slideToggle(false)}
                                  onSelect={newValue => {
                                    slideToggle(false);
                                    setFieldValue('orderItem', newValue);
                                    if (
                                      hasPermission(BATCH_UPDATE) ||
                                      [
                                        BATCH_SET_PACKAGE_NAME,
                                        BATCH_SET_PACKAGE_CAPACITY,
                                        BATCH_SET_PACKAGE_WEIGHT,
                                        BATCH_SET_PACKAGE_VOLUME,
                                        BATCH_SET_PACKAGE_SIZE,
                                      ].every(hasPermission)
                                    ) {
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
                                    }
                                  }}
                                />
                              )}
                            </SlideView>
                          </React.Fragment>
                        )}
                      </BooleanValue>
                    ) : (
                      <ItemCard
                        orderItem={compiledOrderItem}
                        productProvider={compiledProductProvider}
                        product={compiledProduct}
                        order={compiledOrder}
                        editable={editable}
                        viewable={viewable}
                        navigable={navigable}
                        config={config}
                        readOnly
                      />
                    )}
                  </div>
                </div>
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
                      editable={hasPermission([BATCH_UPDATE, BATCH_SET_MEMO])}
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

export default React.memo<Props>(BatchSection);
