// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import BatchFormContainer from 'modules/batch/form/container';
import validator from 'modules/batch/form/validator';
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
import { getByPath } from 'utils/fp';
import { PackagingSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const PackagingSection = ({ isNew }: Props) => (
  <div className={PackagingSectionWrapperStyle}>
    <Subscribe to={[BatchFormContainer]}>
      {({ originalValues, state, setFieldValue, setFieldArrayValue }) => {
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
                    formHelper.onValidation({ ...values, ...newValue }, validator)
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
                    formHelper.onValidation({ ...values, ...newValue }, validator)
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
                    formHelper.onValidation({ ...values, ...newValue }, validator)
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
                  name="packageGrossWeight.value"
                  initValue={getByPath('packageGrossWeight.value', originalValues)}
                  onValidate={newValue =>
                    formHelper.onValidation({ ...values, ...newValue }, validator)
                  }
                  setFieldValue={(field, value) =>
                    setFieldArrayValue('packageGrossWeight', { value, metric: 'kg' })
                  }
                  {...formHelper}
                >
                  {({ name, ...inputHandlers }) => (
                    <FieldItem
                      label={<Label>PKG GROSS WEIGHT</Label>}
                      tooltip={
                        <Tooltip
                          isNew={isNew}
                          changedValues={{
                            oldValue: getByPath('packageGrossWeight.value', originalValues),
                            newValue: inputHandlers.value,
                          }}
                        />
                      }
                      input={
                        <DefaultWeightStyle
                          unit={getByPath('packageGrossWeight.metric', originalValues)}
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
                  name="packageVolume.value"
                  initValue={getByPath('packageVolume.value', originalValues)}
                  onValidate={newValue =>
                    formHelper.onValidation({ ...values, ...newValue }, validator)
                  }
                  setFieldValue={(field, value) =>
                    setFieldArrayValue('packageVolume', { value, metric: 'm3' })
                  }
                  {...formHelper}
                >
                  {({ name, ...inputHandlers }) => (
                    <FieldItem
                      label={<Label>PKG VOLUME</Label>}
                      tooltip={
                        <Tooltip
                          isNew={isNew}
                          changedValues={{
                            oldValue: getByPath('packageVolume.value', originalValues),
                            newValue: inputHandlers.value,
                          }}
                        />
                      }
                      input={
                        <DefaultVolumeStyle
                          unit={getByPath('packageVolume.metric', originalValues)}
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
                  name="packageSize.length.value"
                  onValidate={newValue =>
                    formHelper.onValidation({ ...values, ...newValue }, validator)
                  }
                  initValue={getByPath('packageSize.length.value', originalValues)}
                  setFieldValue={(field, value) =>
                    setFieldArrayValue('packageSize.length', { value, metric: 'cm' })
                  }
                  {...formHelper}
                >
                  {({ name, ...inputHandlers }) => (
                    <FieldItem
                      label={<Label>PKG LENGTH</Label>}
                      tooltip={
                        <Tooltip
                          isNew={isNew}
                          changedValues={{
                            oldValue: getByPath('packageSize.length.value', originalValues),
                            newValue: inputHandlers.value,
                          }}
                        />
                      }
                      input={
                        <DefaultDimensionStyle
                          unit={getByPath('packageSize.length.metric', originalValues)}
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
                  name="packageSize.width.value"
                  onValidate={newValue =>
                    formHelper.onValidation({ ...values, ...newValue }, validator)
                  }
                  initValue={getByPath('packageSize.width.value', originalValues)}
                  setFieldValue={(field, value) =>
                    setFieldArrayValue('packageSize.width', { value, metric: 'cm' })
                  }
                  {...formHelper}
                >
                  {({ name, ...inputHandlers }) => (
                    <FieldItem
                      label={<Label>PKG WIDTH</Label>}
                      tooltip={
                        <Tooltip
                          isNew={isNew}
                          changedValues={{
                            oldValue: getByPath('packageSize.width.value', originalValues),
                            newValue: inputHandlers.value,
                          }}
                        />
                      }
                      input={
                        <DefaultDimensionStyle
                          unit={getByPath('packageSize.width.metric', originalValues)}
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
                  name="packageSize.height.value"
                  onValidate={newValue =>
                    formHelper.onValidation({ ...values, ...newValue }, validator)
                  }
                  initValue={getByPath('packageSize.height.value', originalValues)}
                  setFieldValue={(field, value) =>
                    setFieldArrayValue('packageSize.height', { value, metric: 'cm' })
                  }
                  {...formHelper}
                >
                  {({ name, ...inputHandlers }) => (
                    <FieldItem
                      label={<Label>PKG HEIGHT</Label>}
                      tooltip={
                        <Tooltip
                          isNew={isNew}
                          changedValues={{
                            oldValue: getByPath('packageSize.height.value', originalValues),
                            newValue: inputHandlers.value,
                          }}
                        />
                      }
                      input={
                        <DefaultDimensionStyle
                          unit={getByPath('packageSize.height.metric', originalValues)}
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
