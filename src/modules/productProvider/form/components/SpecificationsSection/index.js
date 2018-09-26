// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import ProductProviderContainer from 'modules/productProvider/form/container';
import { FormField } from 'modules/form';
import { textInputFactory, numberInputFactory, priceInputFactory } from 'modules/form/helpers';
import GridColumn from 'components/GridColumn';
import { DefaultWeightStyle, DefaultVolumeStyle, DefaultDimensionStyle } from 'components/Form';
import { getByPath } from 'utils/fp';
import { SpecificationsSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const SpecificationsSection = ({ isNew }: Props) => (
  <div className={SpecificationsSectionWrapperStyle}>
    <Subscribe to={[ProductProviderContainer]}>
      {({ originalValues, state, setFieldValue }) => {
        const values = { ...originalValues, ...state };

        return (
          <GridColumn>
            <FormField name="unitType" initValue={values.unitType} setFieldValue={setFieldValue}>
              {({ name, ...inputHandlers }) =>
                textInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  initValue: originalValues[name],
                  label: 'UNIT TYPE',
                })
              }
            </FormField>

            <FormField
              name="unitPrice"
              initValue={values.unitPrice.amount}
              setFieldValue={(field, amount) =>
                setFieldValue('unitPrice', { amount, currency: 'JPY' })
              }
            >
              {({ name, ...inputHandlers }) =>
                priceInputFactory({
                  name,
                  isNew,
                  inputHandlers,
                  initValue: originalValues[name].amount,
                  label: 'UNIT PRICE',
                  currency: 'JPY',
                })
              }
            </FormField>

            <FormField
              name="unitWeight.value"
              initValue={getByPath('unitWeight.value', values)}
              setFieldValue={(field, value) => setFieldValue('unitWeight', { value, metric: 'kg' })}
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  initValue: getByPath('unitWeight.value', originalValues),
                  label: 'UNIT WEIGHT',
                  WrapperComponent: DefaultWeightStyle,
                })
              }
            </FormField>

            <FormField
              name="unitVolume.value"
              initValue={getByPath('unitVolume.value', values)}
              setFieldValue={(field, value) => setFieldValue('unitVolume', { value, metric: 'm3' })}
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  initValue: getByPath('unitVolume.value', originalValues),
                  label: 'UNIT VOLUME',
                  WrapperComponent: DefaultVolumeStyle,
                })
              }
            </FormField>

            <FormField
              name="unitSize.length.value"
              initValue={getByPath('unitSize.length.value', values)}
              setFieldValue={(field, value) =>
                setFieldValue('unitSize.length', { value, metric: 'cm' })
              }
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  initValue: getByPath('unitSize.length.value', originalValues),
                  label: 'UNIT LENGTH',
                  WrapperComponent: DefaultDimensionStyle,
                })
              }
            </FormField>

            <FormField
              name="unitSize.width.value"
              initValue={getByPath('unitSize.width.value', values)}
              setFieldValue={(field, value) =>
                setFieldValue('unitSize.width', { value, metric: 'cm' })
              }
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  initValue: getByPath('unitSize.width.value', originalValues),
                  label: 'UNIT WIDTH',
                  WrapperComponent: DefaultDimensionStyle,
                })
              }
            </FormField>

            <FormField
              name="unitSize.height.value"
              initValue={getByPath('unitSize.height.value', values)}
              setFieldValue={(field, value) =>
                setFieldValue('unitSize.height', { value, metric: 'cm' })
              }
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  initValue: getByPath('unitSize.height.value', originalValues),
                  label: 'UNIT HEIGHT',
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

export default SpecificationsSection;
