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
  weightInputFactory,
  volumeInputFactory,
  distanceInputFactory,
} from 'modules/form/helpers';
import GridColumn from 'components/GridColumn';
import { getByPath } from 'utils/fp';
import { SpecificationsSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const SpecificationsSection = ({ isNew }: Props) => (
  <div className={SpecificationsSectionWrapperStyle}>
    <Subscribe to={[ProductProviderContainer]}>
      {({ originalValues, state, setFieldValue, setFieldArrayValue, calculateUnitVolume }) => {
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
                      id="modules.ProductProviders.unitType"
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
                      id="modules.ProductProviders.unitPrice"
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
                      id="modules.ProductProviders.unitPriceCurrency"
                      defaultMessage="UNIT PRICE CURRENCY"
                    />
                  ),
                })
              }
            </FormField>

            <FormField
              name="unitWeight"
              initValue={getByPath('unitWeight', values)}
              setFieldValue={(field, value) => setFieldArrayValue('unitWeight', value)}
            >
              {({ name, ...inputHandlers }) =>
                weightInputFactory({
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('unitWeight', originalValues),
                  label: (
                    <FormattedMessage
                      id="modules.ProductProviders.unitWeight"
                      defaultMessage="UNIT WEIGHT"
                    />
                  ),
                })
              }
            </FormField>

            <FormField
              name="unitVolume"
              initValue={getByPath('unitVolume', values)}
              setFieldValue={(field, value) => setFieldArrayValue('unitVolume', value)}
            >
              {({ name, ...inputHandlers }) =>
                volumeInputFactory({
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('unitVolume', originalValues),
                  label: (
                    <FormattedMessage
                      id="modules.ProductProviders.unitVolume"
                      defaultMessage="UNIT VOLUME"
                    />
                  ),
                  calculate: calculateUnitVolume,
                })
              }
            </FormField>

            <FormField
              name="unitSize.length"
              initValue={getByPath('unitSize.length', values)}
              setFieldValue={(field, value) => setFieldArrayValue('unitSize.length', value)}
            >
              {({ name, ...inputHandlers }) =>
                distanceInputFactory({
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('unitSize.length', originalValues),
                  label: (
                    <FormattedMessage
                      id="modules.ProductProviders.unitLength"
                      defaultMessage="UNIT LENGTH"
                    />
                  ),
                })
              }
            </FormField>

            <FormField
              name="unitSize.width"
              initValue={getByPath('unitSize.width', values)}
              setFieldValue={(field, value) => setFieldArrayValue('unitSize.width', value)}
            >
              {({ name, ...inputHandlers }) =>
                distanceInputFactory({
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('unitSize.width', originalValues),
                  label: (
                    <FormattedMessage
                      id="modules.ProductProviders.unitWidth"
                      defaultMessage="UNIT WIDTH"
                    />
                  ),
                })
              }
            </FormField>

            <FormField
              name="unitSize.height"
              initValue={getByPath('unitSize.height', values)}
              setFieldValue={(field, value) => setFieldArrayValue('unitSize.height', value)}
            >
              {({ name, ...inputHandlers }) =>
                distanceInputFactory({
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('unitSize.height', originalValues),
                  label: (
                    <FormattedMessage
                      id="modules.ProductProviders.unitHeight"
                      defaultMessage="UNIT HEIGHT"
                    />
                  ),
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
