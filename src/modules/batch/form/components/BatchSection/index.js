// @flow
import * as React from 'react';
import { Location } from '@reach/router';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import SlideView from 'components/SlideView';
import BatchFormContainer from 'modules/batch/form/container';
import validator from 'modules/batch/form/validator';
import { FormField } from 'modules/form';
import {
  textInputFactory,
  numberInputFactory,
  dateInputFactory,
  textAreaFactory,
  customFieldsInputFactory,
} from 'modules/form/helpers';
import { OrderItemCard } from 'components/Cards';
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
      {({ originalValues: initialValues, state, setFieldValue }) => {
        const values = { ...initialValues, ...state };
        const { batchAdjustments = [] } = values;
        const totalAdjustment = batchAdjustments
          ? batchAdjustments.reduce((total, adjustment) => adjustment.quantity + total, 0)
          : 0;

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
                  {({ name, ...inputHandlers }) =>
                    numberInputFactory({
                      inputHandlers: {
                        ...inputHandlers,
                        onBlur: evt => {
                          inputHandlers.onBlur(evt);
                          setFieldValue('quantity', inputHandlers.value - totalAdjustment);
                        },
                      },
                      name,
                      isNew,
                      required: true,
                      originalValue: initialValues[name] + totalAdjustment,
                      label: <FormattedMessage {...messages.quantity} />,
                    })
                  }
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
                {customFieldsInputFactory({
                  entityType: 'Batch',
                  customFields: values.customFields,
                  setFieldValue,
                })}
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
                        <Location>
                          {({ location }) => (
                            <>
                              <OrderItemCard
                                selectable={location.pathname.includes('/batch')}
                                item={values.orderItem}
                                onSelect={selectable ? () => slideToggle(true) : null}
                                readOnly
                              />
                            </>
                          )}
                        </Location>
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
                  editable={isNew}
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
