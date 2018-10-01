// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import BatchFormContainer from 'modules/batch/form/container';
import { FormField } from 'modules/form';
import { textInputFactory, numberInputFactory } from 'modules/form/helpers';
import GridColumn from 'components/GridColumn';
import { DefaultWeightStyle, DefaultVolumeStyle, DefaultDimensionStyle } from 'components/Form';
import { getByPath } from 'utils/fp';
import { PackagingSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const PackagingSection = ({ isNew }: Props) => (
  <div className={PackagingSectionWrapperStyle}>
    <Subscribe to={[BatchFormContainer]}>
      {({ originalValues, state, setFieldValue, setFieldArrayValue }) => {
        // $FlowFixMe
        const values = { ...originalValues, ...state };

        return (
          <GridColumn>
            <FormField
              name="packageName"
              initValue={values.packageName}
              setFieldValue={setFieldValue}
            >
              {({ name, ...inputHandlers }) =>
                textInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: originalValues[name],
                  label: 'PACKAGE NAME',
                })
              }
            </FormField>

            <FormField
              name="packageQuantity"
              initValue={values.packageQuantity}
              setFieldValue={setFieldValue}
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: originalValues[name],
                  label: 'PACKAGE QUANTITY',
                })
              }
            </FormField>

            <FormField
              name="packageGrossWeight.value"
              initValue={getByPath('packageGrossWeight.value', values)}
              setFieldValue={(field, value) =>
                setFieldArrayValue('packageGrossWeight', { value, metric: 'kg' })
              }
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('packageGrossWeight.value', originalValues),
                  label: 'PKG GROSS WEIGHT',
                  WrapperComponent: DefaultWeightStyle,
                })
              }
            </FormField>

            <FormField
              name="packageVolume.value"
              initValue={getByPath('packageVolume.value', values)}
              setFieldValue={(field, value) =>
                setFieldArrayValue('packageVolume', { value, metric: 'm³' })
              }
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('packageVolume.value', originalValues),
                  label: 'PKG VOLUME',
                  WrapperComponent: DefaultVolumeStyle,
                })
              }
            </FormField>

            <FormField
              name="packageSize.length.value"
              initValue={getByPath('packageSize.length.value', values)}
              setFieldValue={(field, value) =>
                setFieldArrayValue('packageSize.length', { value, metric: 'cm' })
              }
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('packageSize.length.value', originalValues),
                  label: 'PKG LENGTH',
                  WrapperComponent: DefaultDimensionStyle,
                })
              }
            </FormField>

            <FormField
              name="packageSize.width.value"
              initValue={getByPath('packageSize.width.value', values)}
              setFieldValue={(field, value) =>
                setFieldArrayValue('packageSize.width', { value, metric: 'cm' })
              }
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('packageSize.width.value', originalValues),
                  label: 'PKG WIDTH',
                  WrapperComponent: DefaultDimensionStyle,
                })
              }
            </FormField>

            <FormField
              name="packageSize.height.value"
              initValue={getByPath('packageSize.height.value', values)}
              setFieldValue={(field, value) =>
                setFieldArrayValue('packageSize.height', { value, metric: 'cm' })
              }
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('packageSize.height.value', originalValues),
                  label: 'PKG HEIGHT',
                  WrapperComponent: DefaultDimensionStyle,
                })
              }
            </FormField>
          </GridColumn>
        );
      }}
    </Subscribe>
  </div>
);

export default PackagingSection;
