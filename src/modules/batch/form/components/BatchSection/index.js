// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import SlideView from 'components/SlideView';
import BatchFormContainer from 'modules/batch/form/container';
import validator from 'modules/batch/form/validator';
import { FormField, FormContainer } from 'modules/form';
import { CustomFieldsFactory } from 'modules/form/factories';
import {
  textInputFactory,
  numberInputFactory,
  dateInputFactory,
  textAreaFactory,
} from 'modules/form/helpers';
import { OrderItemCard } from 'components/Cards';
import { totalAdjustQuantity } from 'components/Cards/utils';
import GridColumn from 'components/GridColumn';
import { FieldItem, Label, DashedPlusButton, TagsInput } from 'components/Form';
import messages from 'modules/batch/messages';
import SelectOrderItem from 'modules/batch/common/SelectOrderItem';
import {
  BatchSectionWrapperStyle,
  MainFieldsWrapperStyle,
  ItemSectionStyle,
  DividerStyle,
} from './style';

type Props = {
  isNew: boolean,
  selectable: boolean,
};

const BatchSection = ({ isNew, selectable }: Props) => (
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
                  {({ name, ...inputHandlers }) =>
                    textInputFactory({
                      inputHandlers,
                      name,
                      isNew,
                      required: true,
                      originalValue: initialValues[name],
                      label: <FormattedMessage {...messages.batchNo} />,
                    })
                  }
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
                      {({ setFieldTouched }) =>
                        numberInputFactory({
                          inputHandlers: {
                            ...inputHandlers,
                            onBlur: evt => {
                              inputHandlers.onBlur(evt);
                              setFieldValue('quantity', inputHandlers.value - totalAdjustment);
                              calculatePackageQuantity(setFieldTouched);
                            },
                          },
                          name,
                          isNew,
                          required: true,
                          originalValue: initialValues[name] + totalAdjustment,
                          label: <FormattedMessage {...messages.quantity} />,
                        })
                      }
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
                  {({ name, ...inputHandlers }) =>
                    dateInputFactory({
                      name,
                      inputHandlers,
                      isNew,
                      originalValue: initialValues[name],
                      label: <FormattedMessage {...messages.deliveredAt} />,
                    })
                  }
                </FormField>

                <FormField
                  name="desiredAt"
                  initValue={values.desiredAt}
                  setFieldValue={setFieldValue}
                  values={values}
                  validator={validator}
                >
                  {({ name, ...inputHandlers }) =>
                    dateInputFactory({
                      name,
                      inputHandlers,
                      isNew,
                      originalValue: initialValues[name],
                      label: <FormattedMessage {...messages.desiredAt} />,
                    })
                  }
                </FormField>

                <FormField
                  name="expiredAt"
                  initValue={values.expiredAt}
                  setFieldValue={setFieldValue}
                  values={values}
                  validator={validator}
                >
                  {({ name, ...inputHandlers }) =>
                    dateInputFactory({
                      name,
                      inputHandlers,
                      isNew,
                      originalValue: initialValues[name],
                      label: <FormattedMessage {...messages.expiredAt} />,
                    })
                  }
                </FormField>

                <FormField
                  name="producedAt"
                  initValue={values.producedAt}
                  setFieldValue={setFieldValue}
                  values={values}
                  validator={validator}
                >
                  {({ name, ...inputHandlers }) =>
                    dateInputFactory({
                      name,
                      inputHandlers,
                      isNew,
                      originalValue: initialValues[name],
                      label: <FormattedMessage {...messages.producedAt} />,
                    })
                  }
                </FormField>
                <CustomFieldsFactory
                  entityType="Batch"
                  customFields={values.customFields}
                  setFieldValue={setFieldValue}
                  editable
                />
              </GridColumn>
              <div className={ItemSectionStyle}>
                <Label required>
                  <FormattedMessage {...messages.orderItem} />
                </Label>
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
                          selectable
                          item={values.orderItem}
                          onSelect={selectable ? () => slideToggle(true) : null}
                          readOnly
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
              {({ name, ...inputHandlers }) =>
                textAreaFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: initialValues[name],
                  label: <FormattedMessage {...messages.memo} />,
                  vertical: true,
                  width: '680px',
                  height: '65px',
                })
              }
            </FormField>

            <div className={DividerStyle} />
          </>
        );
      }}
    </Subscribe>
  </div>
);

export default BatchSection;
