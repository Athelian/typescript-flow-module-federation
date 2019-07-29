// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Subscribe } from 'unstated';
import emitter from 'utils/emitter';
import { encodeId } from 'utils/id';
import { spreadOrderItem } from 'utils/item';
import Icon from 'components/Icon';
import { TAG_LIST } from 'modules/permission/constants/tag';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { PRODUCT_FORM } from 'modules/permission/constants/product';
import { ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import {
  BATCH_UPDATE,
  BATCH_SET_NO,
  BATCH_SET_DELIVERY_DATE,
  BATCH_SET_DESIRED_DATE,
  BATCH_SET_EXPIRY,
  BATCH_SET_PRODUCTION_DATE,
  BATCH_SET_CUSTOM_FIELDS,
  BATCH_SET_TAGS,
  BATCH_SET_MEMO,
  BATCH_SET_CUSTOM_FIELDS_MASK,
} from 'modules/permission/constants/batch';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { BatchInfoContainer } from 'modules/batch/form/containers';
import validator from 'modules/batch/form/validator';
import { FormField } from 'modules/form';
import { ItemCard } from 'components/Cards';
import GridColumn from 'components/GridColumn';
import { HIDE, NAVIGABLE, READONLY } from 'modules/batch/constants';
import type { ItemConfigType } from 'modules/batch/type';
import {
  SectionHeader,
  LastModified,
  FormTooltip,
  SectionWrapper,
  FieldItem,
  Label,
  TagsInput,
  CustomFieldsFactory,
  TextInputFactory,
  DateInputFactory,
  TextAreaInputFactory,
} from 'components/Form';
import messages from 'modules/batch/messages';
import {
  StatusStyle,
  StatusLabelStyle,
  BatchSectionWrapperStyle,
  MainFieldsWrapperStyle,
  ItemSectionStyle,
  DividerStyle,
} from './style';

type Props = {
  batch: Object,
  itemConfig: ItemConfigType,
};

const BatchSection = ({ batch, itemConfig }: Props) => {
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
          </>
        )}
      </SectionHeader>
      <div className={BatchSectionWrapperStyle}>
        <Subscribe to={[BatchInfoContainer]}>
          {({ originalValues, state, setFieldValue }) => {
            const values = { ...originalValues, ...state };

            const { orderItem: rawOrderItem } = values;
            const { orderItem, productProvider, product, order } = spreadOrderItem(rawOrderItem);

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
                          required
                          originalValue={originalValues[name]}
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
                          originalValue={originalValues[name]}
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
                          originalValue={originalValues[name]}
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
                          originalValue={originalValues[name]}
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
                          originalValue={originalValues[name]}
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
                          onChange={value => {
                            setFieldValue('tags', value);
                          }}
                          onClickRemove={value => {
                            setFieldValue('tags', values.tags.filter(({ id }) => id !== value.id));
                          }}
                          editable={{
                            set:
                              hasPermission(TAG_LIST) &&
                              hasPermission([BATCH_UPDATE, BATCH_SET_TAGS]),
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
                          originalValue={originalValues[name]}
                          label={<FormattedMessage {...messages.memo} />}
                          editable={hasPermission([BATCH_UPDATE, BATCH_SET_MEMO])}
                          vertical
                          inputWidth="400px"
                          inputHeight="120px"
                        />
                      )}
                    </FormField>
                  </GridColumn>
                  {itemConfig !== HIDE && (
                    <div className={ItemSectionStyle}>
                      <Label required>
                        <FormattedMessage {...messages.orderItem} />
                      </Label>
                      <ItemCard
                        orderItem={orderItem}
                        productProvider={productProvider}
                        product={product}
                        order={order}
                        editable={editable}
                        viewable={viewable}
                        navigable={navigable}
                        config={config}
                        readOnly={itemConfig === READONLY}
                        onClick={() => {
                          if (itemConfig === NAVIGABLE) {
                            navigate(`/order-item/${encodeId(orderItem.id)}`);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

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
