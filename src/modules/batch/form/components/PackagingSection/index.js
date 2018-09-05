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
  // DefaultDimensionStyle,
  TextInput,
  NumberInput,
} from 'components/Form';
import { PackagingSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
  initialValues: Object,
};

const PackagingSection = ({ isNew, initialValues }: Props) => (
  <div className={PackagingSectionWrapperStyle}>
    <Subscribe to={[BatchFormContainer]}>
      {({ state, setFieldValue, validationRules }) => {
        const values = { ...initialValues, ...state };
        console.warn('initialValues', initialValues);
        console.warn('values', values);

        return (
          <Subscribe to={[FormContainer]}>
            {({ state: { activeField }, ...formHelper }) => (
              <GridColumn>
                <FormField
                  name="packageName"
                  initValue={values.packageName}
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
                            oldValue: initialValues[name],
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
                  initValue={values.packageCapacity}
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
                            oldValue: initialValues[name],
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
                  initValue={values.packageQuantity}
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
                            oldValue: initialValues[name],
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
                  name="packageGrossWeight"
                  initValue={values.packageGrossWeight}
                  validationOnChange
                  onValidate={newValue =>
                    formHelper.onValidation({ ...values, ...newValue }, validationRules())
                  }
                  setFieldValue={setFieldValue}
                  {...formHelper}
                >
                  {({ name, value, onChange, ...inputHandlers }) => (
                    <FieldItem
                      label={<Label>PKG GROSS WEIGHT</Label>}
                      tooltip={
                        <Tooltip
                          isNew={isNew}
                          changedValues={{
                            oldValue: `${initialValues[name].value} ${initialValues[name].metric}`,
                            newValue: `${values[name].value} ${values[name].metric}`,
                          }}
                        />
                      }
                      input={
                        <DefaultWeightStyle
                          unit={value.metric}
                          isFocused={activeField === name}
                          forceHoverStyle={isNew}
                          width="200px"
                        >
                          <NumberInput
                            name={name}
                            value={value.value}
                            onChange={evt =>
                              onChange({
                                target: {
                                  value: {
                                    value: evt.target.value,
                                    metric: 'kg',
                                  },
                                },
                              })
                            }
                            {...inputHandlers}
                          />
                        </DefaultWeightStyle>
                      }
                    />
                  )}
                </FormField>
                <h3>{JSON.stringify(values.packageVolume)}</h3>
                <FormField
                  name="packageVolume"
                  key={`${values.packageVolume.value}-${values.packageVolume.metric}`}
                  initValue={values.packageVolume}
                  validationOnChange
                  onValidate={newValue =>
                    formHelper.onValidation({ ...values, ...newValue }, validationRules())
                  }
                  setFieldValue={setFieldValue}
                  {...formHelper}
                >
                  {({ name, value, onChange, ...inputHandlers }) =>
                    console.warn('test', value) || (
                      <FieldItem
                        label={<Label>PKG VOLUME</Label>}
                        tooltip={
                          <Tooltip
                            isNew={isNew}
                            changedValues={{
                              oldValue: `${initialValues[name].value} ${
                                initialValues[name].metric
                              }`,
                              newValue: `${values[name].value} ${values[name].metric}`,
                            }}
                          />
                        }
                        input={
                          <DefaultVolumeStyle
                            unit={value.metric}
                            isFocused={activeField === name}
                            forceHoverStyle={isNew}
                            width="200px"
                          >
                            <NumberInput
                              name={name}
                              value={value.value}
                              onChange={evt =>
                                onChange({
                                  target: {
                                    value: {
                                      value: evt.target.value,
                                      metric: 'cm³',
                                    },
                                  },
                                })
                              }
                              {...inputHandlers}
                            />
                          </DefaultVolumeStyle>
                        }
                      />
                    )
                  }
                </FormField>

                {/* <FormField
                  name="packageSizeLength"
                  initValue={values.packageSize.length}
                  validationOnChange
                  onValidate={newValue =>
                    formHelper.onValidation({ ...values, ...newValue }, validationRules())
                  }
                  setFieldValue={setFieldValue}
                  {...formHelper}
                >
                  {({ name, value, onChange, ...inputHandlers }) => (
                    <FieldItem
                      label={<Label>PKG LENGTH</Label>}
                      tooltip={
                        <Tooltip
                          isNew={isNew}
                          changedValues={{
                            oldValue: `${initialValues.packageSize.length.value} ${
                              initialValues.packageSize.length.metric
                            }`,
                            newValue: `${value.value} ${value.metric}`,
                          }}
                        />
                      }
                      input={
                        <DefaultDimensionStyle
                          unit={value.metric}
                          isFocused={activeField === name}
                          forceHoverStyle={isNew}
                          width="200px"
                        >
                          <NumberInput
                            name={name}
                            value={value.value}
                            onChange={evt =>
                              onChange({
                                target: {
                                  value: {
                                    value: evt.target.value,
                                    metric: 'cm',
                                  },
                                },
                              })
                            }
                            {...inputHandlers}
                          />
                        </DefaultDimensionStyle>
                      }
                    />
                  )}
                </FormField> */}
              </GridColumn>
            )}
          </Subscribe>
        );
      }}
    </Subscribe>
  </div>
);

export default PackagingSection;
