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
  PRODUCT_PROVIDER_CREATE,
  PRODUCT_PROVIDER_UPDATE,
  PRODUCT_PROVIDER_GET_UNIT_TYPE,
  PRODUCT_PROVIDER_GET_UNIT_PRICE,
} from 'modules/permission/constants/product';
import { getByPath } from 'utils/fp';
import { SpecificationsSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
  isOwner: boolean,
};

const SpecificationsSection = ({ isNew, isOwner }: Props) => {
  const { hasPermission } = usePermission(isOwner);
  const canCreateOrUpdate =
    hasPermission(PRODUCT_PROVIDER_CREATE) || hasPermission(PRODUCT_PROVIDER_UPDATE);

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
              <FormField name="unitType" initValue={values.unitType} setFieldValue={setFieldValue}>
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
                    editable={canCreateOrUpdate}
                    blackout={!hasPermission(PRODUCT_PROVIDER_GET_UNIT_TYPE)}
                  />
                )}
              </FormField>

              <FormField
                name="unitPrice.amount"
                initValue={getByPath('unitPrice.amount', values)}
                setFieldValue={setFieldValue}
              >
                {({ name, ...inputHandlers }) => (
                  <NumberInputFactory
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={getByPath('unitPrice.amount', originalValues)}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.unitPrice"
                        defaultMessage="UNIT PRICE"
                      />
                    }
                    editable={canCreateOrUpdate}
                    blackout={!hasPermission(PRODUCT_PROVIDER_GET_UNIT_PRICE)}
                  />
                )}
              </FormField>

              <FormField
                name="unitPrice.currency"
                initValue={getByPath('unitPrice.currency', values)}
                setFieldValue={setFieldValue}
              >
                {({ name, ...inputHandlers }) => (
                  <EnumSearchSelectInputFactory
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={getByPath('unitPrice.currency', originalValues)}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.unitPriceCurrency"
                        defaultMessage="UNIT PRICE CURRENCY"
                      />
                    }
                    editable={canCreateOrUpdate}
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
                    editable={canCreateOrUpdate}
                  />
                )}
              </FormField>

              <FormField
                name="unitVolume"
                initValue={getByPath('unitVolume', values)}
                setFieldValue={(field, value) => setFieldArrayValue('unitVolume', value)}
                values={values}
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
                    editable={canCreateOrUpdate}
                    showExtraToggleButton={canCreateOrUpdate}
                    autoCalculateIsToggled={values.autoCalculateUnitVolume}
                    onToggleAutoCalculate={() => toggleAutoCalculateUnitVolume()}
                  />
                )}
              </FormField>

              <FormField
                name="unitSize.length"
                initValue={getByPath('unitSize.length', values)}
                setFieldValue={(field, value) => {
                  setFieldArrayValue('unitSize.length', value);
                  if (canCreateOrUpdate && values.autoCalculateUnitVolume) {
                    calculateUnitVolume();
                  }
                }}
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
                        defaultMessage="UNIT LENGTH"
                      />
                    }
                    editable={canCreateOrUpdate}
                  />
                )}
              </FormField>

              <FormField
                name="unitSize.width"
                initValue={getByPath('unitSize.width', values)}
                setFieldValue={(field, value) => {
                  setFieldArrayValue('unitSize.width', value);
                  if (canCreateOrUpdate && values.autoCalculateUnitVolume) {
                    calculateUnitVolume();
                  }
                }}
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
                    editable={canCreateOrUpdate}
                  />
                )}
              </FormField>

              <FormField
                name="unitSize.height"
                initValue={getByPath('unitSize.height', values)}
                setFieldValue={(field, value) => {
                  setFieldArrayValue('unitSize.height', value);
                  if (canCreateOrUpdate && values.autoCalculateUnitVolume) {
                    calculateUnitVolume();
                  }
                }}
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
                    editable={canCreateOrUpdate}
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
