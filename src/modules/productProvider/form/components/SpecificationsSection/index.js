// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import usePermission from 'hooks/usePermission';
import { ProductProviderInfoContainer } from 'modules/productProvider/form/containers';
import { FormField } from 'modules/form';
import {
  TextInputFactory,
  NumberInputFactory,
  EnumSearchSelectInputFactory,
  MetricInputFactory,
} from 'components/Form';
import GridColumn from 'components/GridColumn';
import {
  PRODUCT_PROVIDER_UPDATE,
  PRODUCT_PROVIDER_GET_UNIT_TYPE,
  PRODUCT_PROVIDER_GET_UNIT_PRICE,
  PRODUCT_PROVIDER_SET_UNIT_TYPE,
  PRODUCT_PROVIDER_SET_UNIT_PRICE,
  PRODUCT_PROVIDER_SET_UNIT_WEIGHT,
  PRODUCT_PROVIDER_SET_UNIT_VOLUME,
  PRODUCT_PROVIDER_SET_UNIT_SIZE,
} from 'modules/permission/constants/product';
import validator from 'modules/productProvider/form/validator';
import { getByPath } from 'utils/fp';
import { toFloat } from 'utils/number';
import { SpecificationsSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
  isOwner: boolean,
};

const SpecificationsSection = ({ isNew, isOwner }: Props) => {
  const { hasPermission } = usePermission(isOwner);

  return (
    <div className={SpecificationsSectionWrapperStyle}>
      <Subscribe to={[ProductProviderInfoContainer]}>
        {({
          originalValues,
          state,
          setFieldValue,
          setFieldArrayValue,
          toggleAutoCalculateUnitVolume,
          calculateUnitVolume,
        }) => {
          const values = { ...originalValues, ...state };

          return (
            <GridColumn>
              <FormField
                name="unitType"
                initValue={values.unitType}
                setFieldValue={setFieldValue}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) => (
                  <TextInputFactory
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={originalValues[name]}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.unitType"
                        defaultMessage="UNIT TYPE"
                      />
                    }
                    editable={hasPermission([
                      PRODUCT_PROVIDER_UPDATE,
                      PRODUCT_PROVIDER_SET_UNIT_TYPE,
                    ])}
                    blackout={!hasPermission(PRODUCT_PROVIDER_GET_UNIT_TYPE)}
                  />
                )}
              </FormField>

              <FormField
                name="unitPrice.amount"
                initValue={getByPath('unitPrice.amount', values)}
                setFieldValue={setFieldValue}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) => (
                  <NumberInputFactory
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    onBlur={(evt: any) => {
                      const { onBlur } = inputHandlers;
                      if (onBlur) {
                        onBlur({
                          ...evt,
                          target: {
                            ...evt.target,
                            value: toFloat(evt.target.value),
                          },
                        });
                      }
                    }}
                    originalValue={getByPath('unitPrice.amount', originalValues)}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.unitPrice"
                        defaultMessage="UNIT PRICE"
                      />
                    }
                    editable={hasPermission([
                      PRODUCT_PROVIDER_UPDATE,
                      PRODUCT_PROVIDER_SET_UNIT_PRICE,
                    ])}
                    blackout={!hasPermission(PRODUCT_PROVIDER_GET_UNIT_PRICE)}
                  />
                )}
              </FormField>

              <FormField
                name="unitPrice.currency"
                initValue={getByPath('unitPrice.currency', values)}
                setFieldValue={setFieldValue}
                validator={validator}
                values={values}
              >
                {({ name, ...inputHandlers }) => (
                  <EnumSearchSelectInputFactory
                    name={name}
                    required
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={getByPath('unitPrice.currency', originalValues)}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.unitPriceCurrency"
                        defaultMessage="UNIT PRICE CURRENCY"
                      />
                    }
                    editable={hasPermission([
                      PRODUCT_PROVIDER_UPDATE,
                      PRODUCT_PROVIDER_SET_UNIT_PRICE,
                    ])}
                    enumType="Currency"
                    blackout={!hasPermission(PRODUCT_PROVIDER_GET_UNIT_PRICE)}
                    hideClearButton
                  />
                )}
              </FormField>

              <FormField
                name="unitWeight"
                initValue={getByPath('unitWeight', values)}
                setFieldValue={(field, value) => setFieldArrayValue('unitWeight', value)}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) => (
                  <MetricInputFactory
                    metricType="weight"
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={getByPath('unitWeight', originalValues)}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.unitWeight"
                        defaultMessage="UNIT WEIGHT"
                      />
                    }
                    editable={hasPermission([
                      PRODUCT_PROVIDER_UPDATE,
                      PRODUCT_PROVIDER_SET_UNIT_WEIGHT,
                    ])}
                  />
                )}
              </FormField>

              <FormField
                name="unitVolume"
                initValue={getByPath('unitVolume', values)}
                setFieldValue={(field, value) => setFieldArrayValue('unitVolume', value)}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) => (
                  <MetricInputFactory
                    metricType="volume"
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={getByPath('unitVolume', originalValues)}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.unitVolume"
                        defaultMessage="UNIT VOLUME"
                      />
                    }
                    editable={hasPermission([
                      PRODUCT_PROVIDER_UPDATE,
                      PRODUCT_PROVIDER_SET_UNIT_VOLUME,
                    ])}
                    showExtraToggleButton={hasPermission([
                      PRODUCT_PROVIDER_UPDATE,
                      PRODUCT_PROVIDER_SET_UNIT_VOLUME,
                    ])}
                    autoCalculateIsToggled={values.autoCalculateUnitVolume}
                    autoCalculateToggleMessages={{
                      editable: {
                        on: (
                          <FormattedMessage
                            id="modules.ProductProviders.unitVolumeTooltipEditableOn"
                            defaultMessage="Automatically calculate by multiplying Unit Width, Unit Height and Unit Depth. Manual input is still available, but will be overridden when Unit Width, Unit Height, or Unit Depth changes."
                          />
                        ),
                        off: (
                          <FormattedMessage
                            id="modules.ProductProviders.unitVolumeTooltipEditableOff"
                            defaultMessage="Manual input only."
                          />
                        ),
                      },
                      readonly: {
                        on: (
                          <FormattedMessage
                            id="modules.ProductProviders.unitVolumeTooltipReadonlyOn"
                            defaultMessage="This field is being automatically calculated by multiplying Unit Width, Unit Height, and Unit Depth."
                          />
                        ),
                        off: (
                          <FormattedMessage
                            id="modules.ProductProviders.unitVolumeTooltipReadonlyOff"
                            defaultMessage="This field is not being automatically calculated by multiplying Unit Width, Unit Height, and Unit Depth."
                          />
                        ),
                      },
                    }}
                    onToggleAutoCalculate={() => toggleAutoCalculateUnitVolume()}
                  />
                )}
              </FormField>

              <FormField
                name="unitSize.width"
                initValue={getByPath('unitSize.width', values)}
                setFieldValue={(field, value) => {
                  setFieldArrayValue('unitSize.width', value);
                  if (
                    hasPermission([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_UNIT_VOLUME]) &&
                    values.autoCalculateUnitVolume
                  ) {
                    calculateUnitVolume();
                  }
                }}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) => (
                  <MetricInputFactory
                    metricType="distance"
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={getByPath('unitSize.width', originalValues)}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.unitWidth"
                        defaultMessage="UNIT WIDTH"
                      />
                    }
                    editable={hasPermission([
                      PRODUCT_PROVIDER_UPDATE,
                      PRODUCT_PROVIDER_SET_UNIT_SIZE,
                    ])}
                  />
                )}
              </FormField>

              <FormField
                name="unitSize.height"
                initValue={getByPath('unitSize.height', values)}
                setFieldValue={(field, value) => {
                  setFieldArrayValue('unitSize.height', value);
                  if (
                    hasPermission([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_UNIT_VOLUME]) &&
                    values.autoCalculateUnitVolume
                  ) {
                    calculateUnitVolume();
                  }
                }}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) => (
                  <MetricInputFactory
                    metricType="distance"
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={getByPath('unitSize.height', originalValues)}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.unitHeight"
                        defaultMessage="UNIT HEIGHT"
                      />
                    }
                    editable={hasPermission([
                      PRODUCT_PROVIDER_UPDATE,
                      PRODUCT_PROVIDER_SET_UNIT_SIZE,
                    ])}
                  />
                )}
              </FormField>

              <FormField
                name="unitSize.length"
                initValue={getByPath('unitSize.length', values)}
                setFieldValue={(field, value) => {
                  setFieldArrayValue('unitSize.length', value);
                  if (
                    hasPermission([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_UNIT_VOLUME]) &&
                    values.autoCalculateUnitVolume
                  ) {
                    calculateUnitVolume();
                  }
                }}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) => (
                  <MetricInputFactory
                    metricType="distance"
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={getByPath('unitSize.length', originalValues)}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.unitLength"
                        defaultMessage="UNIT DEPTH"
                      />
                    }
                    editable={hasPermission([
                      PRODUCT_PROVIDER_UPDATE,
                      PRODUCT_PROVIDER_SET_UNIT_SIZE,
                    ])}
                  />
                )}
              </FormField>
            </GridColumn>
          );
        }}
      </Subscribe>
    </div>
  );
};

export default SpecificationsSection;
