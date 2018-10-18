// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import ProductProviderContainer from 'modules/productProvider/form/container';
import { FormField } from 'modules/form';
import {
  textInputFactory,
  numberInputFactory,
  selectSearchEnumInputFactory,
} from 'modules/form/helpers';
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
      {({ originalValues, state, setFieldValue, calculateUnitVolume }) => {
        // $FlowFixMe
        const values = { ...originalValues, ...state };

        return (
          <GridColumn>
            <FormField name="unitType" initValue={values.unitType} setFieldValue={setFieldValue}>
              {({ name, ...inputHandlers }) =>
                textInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: originalValues[name],
                  label: (
                    <FormattedMessage
                      id="modules.productProvider.unitType"
                      defaultMessage="UNIT TYPE"
                    />
                  ),
                })
              }
            </FormField>

            <FormField
              name="unitPrice.amount"
              initValue={values.unitPrice.amount}
              setFieldValue={setFieldValue}
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  isNew,
                  inputHandlers,
                  originalValue: originalValues.unitPrice.amount,
                  label: (
                    <FormattedMessage
                      id="modules.productProvider.unitPrice"
                      defaultMessage="UNIT PRICE"
                    />
                  ),
                })
              }
            </FormField>

            <FormField
              name="unitPrice.currency"
              initValue={values.unitPrice.currency}
              setFieldValue={setFieldValue}
            >
              {({ name, ...inputHandlers }) =>
                selectSearchEnumInputFactory({
                  enumType: 'Currency',
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: originalValues.unitPrice.currency,
                  label: (
                    <FormattedMessage
                      id="modules.productProvider.unitPriceCurrency"
                      defaultMessage="UNIT PRICE CURRENCY"
                    />
                  ),
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
                  originalValue: getByPath('unitWeight.value', originalValues),
                  label: (
                    <FormattedMessage
                      id="modules.productProvider.unitWeight"
                      defaultMessage="UNIT WEIGHT"
                    />
                  ),
                  WrapperComponent: DefaultWeightStyle,
                })
              }
            </FormField>

            <FormField
              name="unitVolume.value"
              initValue={getByPath('unitVolume.value', values)}
              setFieldValue={(field, value) => setFieldValue('unitVolume', { value, metric: 'm³' })}
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('unitVolume.value', originalValues),
                  label: (
                    <FormattedMessage
                      id="modules.productProvider.unitVolume"
                      defaultMessage="UNIT VOLUME"
                    />
                  ),
                  WrapperComponent: DefaultVolumeStyle,
                  calculate: calculateUnitVolume,
                })
              }
            </FormField>

            <FormField
              name="unitSize.length.value"
              initValue={getByPath('unitSize.length.value', values)}
              setFieldValue={(field, value) =>
                setFieldValue('unitSize.length', { value, metric: 'm' })
              }
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('unitSize.length.value', originalValues),
                  label: (
                    <FormattedMessage
                      id="modules.productProvider.unitLength"
                      defaultMessage="UNIT LENGTH"
                    />
                  ),
                  WrapperComponent: DefaultDimensionStyle,
                })
              }
            </FormField>

            <FormField
              name="unitSize.width.value"
              initValue={getByPath('unitSize.width.value', values)}
              setFieldValue={(field, value) =>
                setFieldValue('unitSize.width', { value, metric: 'm' })
              }
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('unitSize.width.value', originalValues),
                  label: (
                    <FormattedMessage
                      id="modules.productProvider.unitWidth"
                      defaultMessage="UNIT WIDTH"
                    />
                  ),
                  WrapperComponent: DefaultDimensionStyle,
                })
              }
            </FormField>

            <FormField
              name="unitSize.height.value"
              initValue={getByPath('unitSize.height.value', values)}
              setFieldValue={(field, value) =>
                setFieldValue('unitSize.height', { value, metric: 'm' })
              }
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('unitSize.height.value', originalValues),
                  label: (
                    <FormattedMessage
                      id="modules.productProvider.unitHeight"
                      defaultMessage="UNIT HEIGHT"
                    />
                  ),
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
