// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import FormattedDate from 'components/FormattedDate';
import SlideView from 'components/SlideView';
import BatchFormContainer from 'modules/batch/form/container';
import { FormContainer, FormField } from 'modules/form';
import { OrderItemCard } from 'components/Cards';
import GridColumn from 'components/GridColumn';
import {
  FieldItem,
  Label,
  Tooltip,
  DefaultStyle,
  DashedPlusButton,
  TextInput,
  NumberInput,
  DateInput,
  TagsInput,
} from 'components/Form';
import messages from 'modules/batch/messages';
import {
  BatchSectionWrapperStyle,
  MainFieldsWrapperStyle,
  ItemSectionStyle,
  TagsInputStyle,
  DividerStyle,
} from './style';
import SelectOrderItem from '../SelectOrderItem';

type Props = {
  isNew: boolean,
  selectable: boolean,
};

const BatchSection = ({ isNew, selectable }: Props) => (
  <div className={BatchSectionWrapperStyle}>
    <Subscribe to={[BatchFormContainer]}>
      {({ originalValues, state, setFieldValue, validationRules }) => {
        const values = { ...originalValues, ...state };

        return (
          <>
            <div className={MainFieldsWrapperStyle}>
              <Subscribe to={[FormContainer]}>
                {({ state: { touched, errors, activeField }, ...formHelper }) => (
                  <GridColumn>
                    <FormField
                      name="no"
                      initValue={values.no}
                      validationOnChange
                      onValidate={newValue =>
                        formHelper.onValidation({ ...values, ...newValue }, validationRules())
                      }
                      setFieldValue={setFieldValue}
                      {...formHelper}
                    >
                      {({ name, ...inputHandlers }) => (
                        <FieldItem
                          label={
                            <Label required>
                              <FormattedMessage {...messages.batchNo} />
                            </Label>
                          }
                          tooltip={
                            <Tooltip
                              isNew={isNew}
                              errorMessage={touched[name] && errors[name]}
                              changedValues={{
                                oldValue: originalValues[name],
                                newValue: values[name],
                              }}
                            />
                          }
                          input={
                            <DefaultStyle
                              isFocused={activeField === name}
                              hasError={touched[name] && errors[name]}
                              forceHoverStyle={isNew}
                              width="200px"
                            >
                              <TextInput name={name} {...inputHandlers} />
                            </DefaultStyle>
                          }
                        />
                      )}
                    </FormField>

                    <FormField
                      name="quantity"
                      initValue={values.quantity}
                      validationOnChange
                      onValidate={newValue =>
                        formHelper.onValidation({ ...values, ...newValue }, validationRules())
                      }
                      setFieldValue={setFieldValue}
                      {...formHelper}
                    >
                      {({ name, ...inputHandlers }) => (
                        <FieldItem
                          label={<Label required>INITIAL QUANTITY</Label>}
                          tooltip={
                            <Tooltip
                              isNew={isNew}
                              errorMessage={touched[name] && errors[name]}
                              changedValues={{
                                oldValue: originalValues[name],
                                newValue: values[name],
                              }}
                            />
                          }
                          input={
                            <DefaultStyle
                              type="number"
                              isFocused={activeField === name}
                              hasError={touched[name] && errors[name]}
                              forceHoverStyle={isNew}
                              width="200px"
                            >
                              <NumberInput name={name} {...inputHandlers} />
                            </DefaultStyle>
                          }
                        />
                      )}
                    </FormField>

                    <FormField
                      name="deliveredAt"
                      initValue={values.deliveredAt}
                      setFieldValue={setFieldValue}
                      onValidate={newValue =>
                        formHelper.onValidation({ ...values, ...newValue }, validationRules())
                      }
                      {...formHelper}
                    >
                      {({ name, ...inputHandlers }) => (
                        <FieldItem
                          label={
                            <Label>
                              <FormattedMessage {...messages.deliveredAt} />
                            </Label>
                          }
                          tooltip={
                            <Tooltip
                              isNew={isNew}
                              changedValues={{
                                oldValue: <FormattedDate value={originalValues[name]} />,
                                newValue: <FormattedDate value={values[name]} />,
                              }}
                            />
                          }
                          input={
                            <DefaultStyle
                              type="date"
                              isFocused={activeField === name}
                              forceHoverStyle={isNew}
                              width="200px"
                            >
                              <DateInput name={name} {...inputHandlers} />
                            </DefaultStyle>
                          }
                        />
                      )}
                    </FormField>

                    <FormField
                      name="expiredAt"
                      initValue={values.expiredAt}
                      setFieldValue={setFieldValue}
                      onValidate={newValue =>
                        formHelper.onValidation({ ...values, ...newValue }, validationRules())
                      }
                      {...formHelper}
                    >
                      {({ name, ...inputHandlers }) => (
                        <FieldItem
                          label={
                            <Label>
                              <FormattedMessage {...messages.expiredAt} />
                            </Label>
                          }
                          tooltip={
                            <Tooltip
                              isNew={isNew}
                              changedValues={{
                                oldValue: <FormattedDate value={originalValues[name]} />,
                                newValue: <FormattedDate value={values[name]} />,
                              }}
                            />
                          }
                          input={
                            <DefaultStyle
                              type="date"
                              isFocused={activeField === name}
                              forceHoverStyle={isNew}
                              width="200px"
                            >
                              <DateInput name={name} {...inputHandlers} />
                            </DefaultStyle>
                          }
                        />
                      )}
                    </FormField>

                    <FormField
                      name="producedAt"
                      initValue={values.producedAt}
                      setFieldValue={setFieldValue}
                      onValidate={newValue =>
                        formHelper.onValidation({ ...values, ...newValue }, validationRules())
                      }
                      {...formHelper}
                    >
                      {({ name, ...inputHandlers }) => (
                        <FieldItem
                          label={
                            <Label>
                              <FormattedMessage {...messages.producedAt} />
                            </Label>
                          }
                          tooltip={
                            <Tooltip
                              isNew={isNew}
                              changedValues={{
                                oldValue: <FormattedDate value={originalValues[name]} />,
                                newValue: <FormattedDate value={values[name]} />,
                              }}
                            />
                          }
                          input={
                            <DefaultStyle
                              type="date"
                              isFocused={activeField === name}
                              forceHoverStyle={isNew}
                              width="200px"
                            >
                              <DateInput name={name} {...inputHandlers} />
                            </DefaultStyle>
                          }
                        />
                      )}
                    </FormField>
                  </GridColumn>
                )}
              </Subscribe>
              <div className={ItemSectionStyle}>
                <Label required>
                  <FormattedMessage {...messages.orderItem} />
                </Label>
                <BooleanValue>
                  {({ value: opened, toggle }) => (
                    <React.Fragment>
                      {!values.orderItem ? (
                        <DashedPlusButton width="195px" height="200px" onClick={toggle} />
                      ) : (
                        <OrderItemCard
                          item={values.orderItem}
                          onSelect={selectable ? toggle : null}
                          selectable={selectable}
                        />
                      )}

                      <SlideView
                        isOpen={opened}
                        onRequestClose={toggle}
                        options={{ width: '1030px' }}
                      >
                        {opened && (
                          <Subscribe to={[FormContainer]}>
                            {({ onValidation, setFieldTouched }) => (
                              <SelectOrderItem
                                selected={values.orderItem}
                                onCancel={toggle}
                                onSelect={newValue => {
                                  toggle();
                                  setFieldTouched('orderItem');
                                  setFieldValue('orderItem', newValue);
                                  onValidation(
                                    {
                                      ...values,
                                      orderItem: newValue,
                                    },
                                    validationRules()
                                  );
                                }}
                              />
                            )}
                          </Subscribe>
                        )}
                      </SlideView>
                    </React.Fragment>
                  )}
                </BooleanValue>
              </div>
            </div>
            <div className={TagsInputStyle}>
              <Subscribe to={[FormContainer]}>
                {({ setFieldTouched }) => (
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
                          setFieldTouched('tags');
                        }}
                      />
                    }
                  />
                )}
              </Subscribe>

              <div className={DividerStyle} />
            </div>
          </>
        );
      }}
    </Subscribe>
  </div>
);

export default BatchSection;
