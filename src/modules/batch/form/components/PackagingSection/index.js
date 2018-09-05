// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import BatchFormContainer from 'modules/batch/form/container';
import { FormContainer, FormField } from 'modules/form';
import GridColumn from 'components/GridColumn';
import {
  FieldItem,
  Label,
  Tooltip,
  DefaultStyle,
  DefaultWeightStyle,
  DefaultVolumeStyle,
  DefaultDimensionStyle,
  TextInput,
  NumberInput,
} from 'components/Form';
import { PackagingSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const PackagingSection = ({ isNew }: Props) => (
  <div className={PackagingSectionWrapperStyle}>
    <Subscribe to={[BatchFormContainer]}>
      {({ originalValues, state, setFieldValue, validationRules }) => {
        const values = { ...originalValues, ...state };

        return (
          <Subscribe to={[FormContainer]}>
            {({ state: { activeField }, ...formHelper }) => (
              <GridColumn>
                <FormField
                  name="packageName"
                  initValue={originalValues.packageName}
                  validationOnChange
                  onValidate={newValue =>
                    formHelper.onValidation({ ...values, ...newValue }, validationRules())
                  }
                  setFieldValue={setFieldValue}
                  {...formHelper}
                >
                  {({ name, ...inputHandlers }) => (
                    <FieldItem
                      label={<Label>PACKAGE NAME</Label>}
                      tooltip={
                        <Tooltip
                          isNew={isNew}
                          changedValues={{
                            oldValue: originalValues[name],
                            newValue: values[name],
                          }}
                        />
                      }
                      input={
                        <DefaultStyle
                          isFocused={activeField === name}
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
                  name="packageCapacity"
                  initValue={originalValues.packageCapacity}
                  validationOnChange
                  onValidate={newValue =>
                    formHelper.onValidation({ ...values, ...newValue }, validationRules())
                  }
                  setFieldValue={setFieldValue}
                  {...formHelper}
                >
                  {({ name, ...inputHandlers }) => (
                    <FieldItem
                      label={<Label>UNITS PER PACKAGE</Label>}
                      tooltip={
                        <Tooltip
                          isNew={isNew}
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
                  name="packageQuantity"
                  initValue={originalValues.packageQuantity}
                  validationOnChange
                  onValidate={newValue =>
                    formHelper.onValidation({ ...values, ...newValue }, validationRules())
                  }
                  setFieldValue={setFieldValue}
                  {...formHelper}
                >
                  {({ name, ...inputHandlers }) => (
                    <FieldItem
                      label={<Label>PACKAGE QUANTITY</Label>}
                      tooltip={
                        <Tooltip
                          isNew={isNew}
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
                  name="packageGrossWeight_value"
                  initValue={originalValues.packageGrossWeight_value}
                  validationOnChange
                  onValidate={newValue =>
                    formHelper.onValidation({ ...values, ...newValue }, validationRules())
                  }
                  setFieldValue={setFieldValue}
                  {...formHelper}
                >
                  {({ name, ...inputHandlers }) => (
                    <FieldItem
                      label={<Label>PKG GROSS WEIGHT</Label>}
                      tooltip={
                        <Tooltip
                          isNew={isNew}
                          changedValues={{
                            oldValue: originalValues[name],
                            newValue: values[name],
                          }}
                        />
                      }
                      input={
                        <DefaultWeightStyle
                          unit={values.packageGrossWeight_metric}
                          isFocused={activeField === name}
                          forceHoverStyle={isNew}
                          width="200px"
                        >
                          <NumberInput name={name} {...inputHandlers} />
                        </DefaultWeightStyle>
                      }
                    />
                  )}
                </FormField>

                <FormField
                  name="packageVolume_value"
                  initValue={originalValues.packageVolume_value}
                  validationOnChange
                  onValidate={newValue =>
                    formHelper.onValidation({ ...values, ...newValue }, validationRules())
                  }
                  setFieldValue={setFieldValue}
                  {...formHelper}
                >
                  {({ name, ...inputHandlers }) => (
                    <FieldItem
                      label={<Label>PKG VOLUME</Label>}
                      tooltip={
                        <Tooltip
                          isNew={isNew}
                          changedValues={{
                            oldValue: originalValues[name],
                            newValue: values[name],
                          }}
                        />
                      }
                      input={
                        <DefaultVolumeStyle
                          unit={values.packageVolume_metric}
                          isFocused={activeField === name}
                          forceHoverStyle={isNew}
                          width="200px"
                        >
                          <NumberInput name={name} {...inputHandlers} />
                        </DefaultVolumeStyle>
                      }
                    />
                  )}
                </FormField>

                <FormField
                  name="packageSize_length_value"
                  initValue={originalValues.packageSize_length_value}
                  validationOnChange
                  onValidate={newValue =>
                    formHelper.onValidation({ ...values, ...newValue }, validationRules())
                  }
                  setFieldValue={setFieldValue}
                  {...formHelper}
                >
                  {({ name, ...inputHandlers }) => (
                    <FieldItem
                      label={<Label>PKG LENGTH</Label>}
                      tooltip={
                        <Tooltip
                          isNew={isNew}
                          changedValues={{
                            oldValue: originalValues[name],
                            newValue: values[name],
                          }}
                        />
                      }
                      input={
                        <DefaultDimensionStyle
                          unit={values.packageSize_length_metric}
                          isFocused={activeField === name}
                          forceHoverStyle={isNew}
                          width="200px"
                        >
                          <NumberInput name={name} {...inputHandlers} />
                        </DefaultDimensionStyle>
                      }
                    />
                  )}
                </FormField>

                <FormField
                  name="packageSize_width_value"
                  initValue={originalValues.packageSize_width_value}
                  validationOnChange
                  onValidate={newValue =>
                    formHelper.onValidation({ ...values, ...newValue }, validationRules())
                  }
                  setFieldValue={setFieldValue}
                  {...formHelper}
                >
                  {({ name, ...inputHandlers }) => (
                    <FieldItem
                      label={<Label>PKG WIDTH</Label>}
                      tooltip={
                        <Tooltip
                          isNew={isNew}
                          changedValues={{
                            oldValue: originalValues[name],
                            newValue: values[name],
                          }}
                        />
                      }
                      input={
                        <DefaultDimensionStyle
                          unit={values.packageSize_width_metric}
                          isFocused={activeField === name}
                          forceHoverStyle={isNew}
                          width="200px"
                        >
                          <NumberInput name={name} {...inputHandlers} />
                        </DefaultDimensionStyle>
                      }
                    />
                  )}
                </FormField>

                <FormField
                  name="packageSize_height_value"
                  initValue={originalValues.packageSize_height_value}
                  validationOnChange
                  onValidate={newValue =>
                    formHelper.onValidation({ ...values, ...newValue }, validationRules())
                  }
                  setFieldValue={setFieldValue}
                  {...formHelper}
                >
                  {({ name, ...inputHandlers }) => (
                    <FieldItem
                      label={<Label>PKG HEIGHT</Label>}
                      tooltip={
                        <Tooltip
                          isNew={isNew}
                          changedValues={{
                            oldValue: originalValues[name],
                            newValue: values[name],
                          }}
                        />
                      }
                      input={
                        <DefaultDimensionStyle
                          unit={values.packageSize_height_metric}
                          isFocused={activeField === name}
                          forceHoverStyle={isNew}
                          width="200px"
                        >
                          <NumberInput name={name} {...inputHandlers} />
                        </DefaultDimensionStyle>
                      }
                    />
                  )}
                </FormField>

              </GridColumn>
            )}
          </Subscribe>
        );
      }}
    </Subscribe>
  </div>
);

export default PackagingSection;
