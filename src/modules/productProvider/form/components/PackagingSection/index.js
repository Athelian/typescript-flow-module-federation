// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import usePermission from 'hooks/usePermission';
import { ProductProviderInfoContainer } from 'modules/productProvider/form/containers';
import { FormField } from 'modules/form';
import { TextInputFactory, NumberInputFactory, MetricInputFactory } from 'components/Form';
import GridColumn from 'components/GridColumn';
import { getByPath } from 'utils/fp';
import {
  PRODUCT_PROVIDER_UPDATE,
  PRODUCT_PROVIDER_SET_PACKAGE_NAME,
  PRODUCT_PROVIDER_SET_PACKAGE_CAPACITY,
  PRODUCT_PROVIDER_SET_PACKAGE_WEIGHT,
  PRODUCT_PROVIDER_SET_PACKAGE_VOLUME,
  PRODUCT_PROVIDER_SET_PACKAGE_SIZE,
} from 'modules/permission/constants/product';
import { PackagingSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
  isOwner: boolean,
};

const PackagingSection = ({ isNew, isOwner }: Props) => {
  const { hasPermission } = usePermission(isOwner);

  return (
    <div className={PackagingSectionWrapperStyle}>
      <Subscribe to={[ProductProviderInfoContainer]}>
        {({
          originalValues,
          state,
          setFieldValue,
          setFieldArrayValue,
          toggleAutoCalculatePackageVolume,
          calculatePackageVolume,
        }) => {
          const values = { ...originalValues, ...state };

          return (
            <GridColumn>
              <FormField
                name="packageName"
                initValue={values.packageName}
                setFieldValue={setFieldValue}
              >
                {({ name, ...inputHandlers }) => (
                  <TextInputFactory
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={originalValues[name]}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.packageName"
                        defaultMessage="PACKAGE NAME"
                      />
                    }
                    editable={hasPermission([
                      PRODUCT_PROVIDER_UPDATE,
                      PRODUCT_PROVIDER_SET_PACKAGE_NAME,
                    ])}
                  />
                )}
              </FormField>

              <FormField
                name="packageCapacity"
                initValue={values.packageCapacity}
                setFieldValue={setFieldValue}
              >
                {({ name, ...inputHandlers }) => (
                  <NumberInputFactory
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={originalValues[name]}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.packageCapacity"
                        defaultMessage="PACKAGE CAPACITY"
                      />
                    }
                    editable={hasPermission([
                      PRODUCT_PROVIDER_UPDATE,
                      PRODUCT_PROVIDER_SET_PACKAGE_CAPACITY,
                    ])}
                  />
                )}
              </FormField>

              <FormField
                name="packageGrossWeight"
                initValue={getByPath('packageGrossWeight', values)}
                setFieldValue={(field, value) => setFieldArrayValue('packageGrossWeight', value)}
              >
                {({ name, ...inputHandlers }) => (
                  <MetricInputFactory
                    metricType="weight"
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={getByPath('packageGrossWeight', originalValues)}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.pkgWeight"
                        defaultMessage="PKG GROSS WEIGHT"
                      />
                    }
                    editable={hasPermission([
                      PRODUCT_PROVIDER_UPDATE,
                      PRODUCT_PROVIDER_SET_PACKAGE_WEIGHT,
                    ])}
                  />
                )}
              </FormField>

              <FormField
                name="packageVolume"
                initValue={getByPath('packageVolume', values)}
                setFieldValue={(field, value) => setFieldArrayValue('packageVolume', value)}
                values={values}
              >
                {({ name, ...inputHandlers }) => (
                  <MetricInputFactory
                    metricType="volume"
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={getByPath('packageVolume', originalValues)}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.pkgVolume"
                        defaultMessage="PKG VOLUME"
                      />
                    }
                    showExtraToggleButton={hasPermission([
                      PRODUCT_PROVIDER_UPDATE,
                      PRODUCT_PROVIDER_SET_PACKAGE_VOLUME,
                    ])}
                    autoCalculateIsToggled={values.autoCalculatePackageVolume}
                    onToggleAutoCalculate={() => toggleAutoCalculatePackageVolume()}
                    autoCalculateToggleMessages={{
                      editable: {
                        on: (
                          <FormattedMessage
                            id="modules.ProductProviders.packageVolumeTooltipEditableOn"
                            defaultMessage="Automatically calculate by multiplying Package Length, Package Width, and Package Height. Manual input is still available, but will be overridden when Package Length, Package Width, or Package Height changes."
                          />
                        ),
                        off: (
                          <FormattedMessage
                            id="modules.ProductProviders.packageVolumeTooltipEditableOff"
                            defaultMessage="Manual input only."
                          />
                        ),
                      },
                      readonly: {
                        on: (
                          <FormattedMessage
                            id="modules.ProductProviders.packageVolumeTooltipReadonlyOn"
                            defaultMessage="This field is being automatically calculated by multiplying Package Length, Package Width, and Package Height."
                          />
                        ),
                        off: (
                          <FormattedMessage
                            id="modules.ProductProviders.packageVolumeTooltipReadonlyOff"
                            defaultMessage="This field is not being automatically calculated by multiplying Package Length, Package Width, and Package Height."
                          />
                        ),
                      },
                    }}
                    editable={hasPermission([
                      PRODUCT_PROVIDER_UPDATE,
                      PRODUCT_PROVIDER_SET_PACKAGE_VOLUME,
                    ])}
                  />
                )}
              </FormField>

              <FormField
                name="packageSize.length"
                initValue={getByPath('packageSize.length', values)}
                setFieldValue={(field, value) => {
                  setFieldArrayValue('packageSize.length', value);
                  if (
                    hasPermission([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_PACKAGE_VOLUME]) &&
                    values.autoCalculatePackageVolume
                  ) {
                    calculatePackageVolume();
                  }
                }}
              >
                {({ name, ...inputHandlers }) => (
                  <MetricInputFactory
                    metricType="distance"
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={getByPath('packageSize.length', originalValues)}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.pkgLength"
                        defaultMessage="PKG LENGTH"
                      />
                    }
                    editable={hasPermission([
                      PRODUCT_PROVIDER_UPDATE,
                      PRODUCT_PROVIDER_SET_PACKAGE_SIZE,
                    ])}
                  />
                )}
              </FormField>

              <FormField
                name="packageSize.width"
                initValue={getByPath('packageSize.width', values)}
                setFieldValue={(field, value) => {
                  setFieldArrayValue('packageSize.width', value);

                  if (
                    hasPermission([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_PACKAGE_VOLUME]) &&
                    values.autoCalculatePackageVolume
                  ) {
                    calculatePackageVolume();
                  }
                }}
              >
                {({ name, ...inputHandlers }) => (
                  <MetricInputFactory
                    metricType="distance"
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={getByPath('packageSize.width', originalValues)}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.pkgWidth"
                        defaultMessage="PKG WIDTH"
                      />
                    }
                    editable={hasPermission([
                      PRODUCT_PROVIDER_UPDATE,
                      PRODUCT_PROVIDER_SET_PACKAGE_SIZE,
                    ])}
                  />
                )}
              </FormField>

              <FormField
                name="packageSize.height"
                initValue={getByPath('packageSize.height', values)}
                setFieldValue={(field, value) => {
                  setFieldArrayValue('packageSize.height', value);
                  if (
                    hasPermission([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_PACKAGE_VOLUME]) &&
                    values.autoCalculatePackageVolume
                  ) {
                    calculatePackageVolume();
                  }
                }}
              >
                {({ name, ...inputHandlers }) => (
                  <MetricInputFactory
                    metricType="distance"
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={getByPath('packageSize.height', originalValues)}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.pkgHeight"
                        defaultMessage="PKG HEIGHT"
                      />
                    }
                    editable={hasPermission([
                      PRODUCT_PROVIDER_UPDATE,
                      PRODUCT_PROVIDER_SET_PACKAGE_SIZE,
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

export default PackagingSection;
