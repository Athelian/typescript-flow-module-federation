// @flow
import * as React from 'react';
import type { ProductProviderPackagePayload } from 'generated/graphql';
import { cloneDeep, set } from 'lodash';
import { FormattedMessage } from 'react-intl';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { FormField } from 'modules/form';
import { TextInputFactory, NumberInputFactory, MetricInputFactory } from 'components/Form';
import GridColumn from 'components/GridColumn';
import { getByPath } from 'utils/fp';
import {
  PRODUCT_PROVIDER_UPDATE,
  PRODUCT_PROVIDER_PACKAGES_UPDATE,
  PRODUCT_PROVIDER_PACKAGE_SET_NAME,
  PRODUCT_PROVIDER_PACKAGE_SET_CAPACITY,
  PRODUCT_PROVIDER_PACKAGE_SET_WEIGHT,
  PRODUCT_PROVIDER_PACKAGE_SET_VOLUME,
  PRODUCT_PROVIDER_PACKAGE_SET_SIZE,
} from 'modules/permission/constants/product';
import { PackagingFormWrapperStyle } from './style';

type Props = {|
  isNew: boolean,
  id: string,
  originalValues: ProductProviderPackagePayload,
  values: ProductProviderPackagePayload,
  onChange: (ProductProviderPackagePayload, boolean) => void,
|};

const PackagingForm = ({ isNew, id, originalValues, values, onChange }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const setFieldValue = React.useCallback(
    (field, value) => {
      const autoCalculate =
        (field.includes('size') && getByPath('autoCalculateVolume', values)) ||
        (field === 'autoCalculateVolume' && value);
      onChange(set(cloneDeep(values), field, value), autoCalculate);
    },
    [onChange, values]
  );

  return (
    <div className={PackagingFormWrapperStyle}>
      <GridColumn>
        <FormField
          name={`${id}.name`}
          initValue={getByPath('name', values)}
          setFieldValue={(field, value) => setFieldValue('name', value)}
        >
          {({ name, ...inputHandlers }) => (
            <TextInputFactory
              name={name}
              {...inputHandlers}
              isNew={isNew}
              originalValue={getByPath('name', originalValues)}
              label={
                <FormattedMessage
                  id="modules.ProductProviders.packageName"
                  defaultMessage="PACKAGE NAME"
                />
              }
              editable={hasPermission([
                PRODUCT_PROVIDER_UPDATE,
                PRODUCT_PROVIDER_PACKAGES_UPDATE,
                PRODUCT_PROVIDER_PACKAGE_SET_NAME,
              ])}
            />
          )}
        </FormField>

        <FormField
          name={`${id}.capacity`}
          initValue={getByPath('capacity', values)}
          setFieldValue={(field, value) => setFieldValue('capacity', value)}
        >
          {({ name, ...inputHandlers }) => (
            <NumberInputFactory
              name={name}
              {...inputHandlers}
              isNew={isNew}
              originalValue={getByPath('capacity', originalValues)}
              label={
                <FormattedMessage
                  id="modules.ProductProviders.packageCapacity"
                  defaultMessage="PACKAGE CAPACITY"
                />
              }
              editable={hasPermission([
                PRODUCT_PROVIDER_UPDATE,
                PRODUCT_PROVIDER_PACKAGES_UPDATE,
                PRODUCT_PROVIDER_PACKAGE_SET_CAPACITY,
              ])}
            />
          )}
        </FormField>

        <FormField
          name={`${id}.grossWeight`}
          initValue={getByPath('grossWeight', values)}
          setFieldValue={(field, value) => setFieldValue('grossWeight', value)}
        >
          {({ name, ...inputHandlers }) => (
            <MetricInputFactory
              metricType="weight"
              name={name}
              {...inputHandlers}
              isNew={isNew}
              originalValue={getByPath('grossWeight', originalValues)}
              label={
                <FormattedMessage
                  id="modules.ProductProviders.grossWeight"
                  defaultMessage="GROSS WEIGHT"
                />
              }
              editable={hasPermission([
                PRODUCT_PROVIDER_UPDATE,
                PRODUCT_PROVIDER_PACKAGES_UPDATE,
                PRODUCT_PROVIDER_PACKAGE_SET_WEIGHT,
              ])}
            />
          )}
        </FormField>

        <FormField
          name={`${id}.volume`}
          initValue={getByPath('volume', values)}
          setFieldValue={(field, value) => setFieldValue('volume', value)}
          values={values}
        >
          {({ name, ...inputHandlers }) => (
            <MetricInputFactory
              metricType="volume"
              name={name}
              {...inputHandlers}
              isNew={isNew}
              originalValue={getByPath('volume', originalValues)}
              label={
                <FormattedMessage
                  id="modules.ProductProviders.pkgVolume"
                  defaultMessage="PKG VOLUME"
                />
              }
              showExtraToggleButton={hasPermission([
                PRODUCT_PROVIDER_UPDATE,
                PRODUCT_PROVIDER_PACKAGES_UPDATE,
                PRODUCT_PROVIDER_PACKAGE_SET_VOLUME,
              ])}
              autoCalculateIsToggled={getByPath('autoCalculateVolume', values)}
              onToggleAutoCalculate={() => {
                setFieldValue('autoCalculateVolume', !getByPath('autoCalculateVolume', values));
              }}
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
                PRODUCT_PROVIDER_PACKAGES_UPDATE,
                PRODUCT_PROVIDER_PACKAGE_SET_VOLUME,
              ])}
            />
          )}
        </FormField>

        <FormField
          name={`${id}.size.width`}
          initValue={getByPath('size.width', values)}
          setFieldValue={(field, value) => setFieldValue('size.width', value)}
        >
          {({ name, ...inputHandlers }) => (
            <MetricInputFactory
              metricType="distance"
              name={name}
              {...inputHandlers}
              isNew={isNew}
              originalValue={getByPath('size.width', originalValues)}
              label={
                <FormattedMessage
                  id="modules.ProductProviders.pkgWidth"
                  defaultMessage="PKG WIDTH"
                />
              }
              editable={hasPermission([
                PRODUCT_PROVIDER_UPDATE,
                PRODUCT_PROVIDER_PACKAGES_UPDATE,
                PRODUCT_PROVIDER_PACKAGE_SET_SIZE,
              ])}
            />
          )}
        </FormField>

        <FormField
          name={`${id}.size.height`}
          initValue={getByPath('size.height', values)}
          setFieldValue={(field, value) => setFieldValue('size.height', value)}
        >
          {({ name, ...inputHandlers }) => (
            <MetricInputFactory
              metricType="distance"
              name={name}
              {...inputHandlers}
              isNew={isNew}
              originalValue={getByPath('size.height', originalValues)}
              label={
                <FormattedMessage
                  id="modules.ProductProviders.pkgHeight"
                  defaultMessage="PKG HEIGHT"
                />
              }
              editable={hasPermission([
                PRODUCT_PROVIDER_UPDATE,
                PRODUCT_PROVIDER_PACKAGES_UPDATE,
                PRODUCT_PROVIDER_PACKAGE_SET_SIZE,
              ])}
            />
          )}
        </FormField>

        <FormField
          name={`${id}.size.length`}
          initValue={getByPath('size.length', values)}
          setFieldValue={(field, value) => setFieldValue('size.length', value)}
        >
          {({ name, ...inputHandlers }) => (
            <MetricInputFactory
              metricType="distance"
              name={name}
              {...inputHandlers}
              isNew={isNew}
              originalValue={getByPath('size.length', originalValues)}
              label={
                <FormattedMessage
                  id="modules.ProductProviders.pkgLength"
                  defaultMessage="PKG DEPTH"
                />
              }
              editable={hasPermission([
                PRODUCT_PROVIDER_UPDATE,
                PRODUCT_PROVIDER_PACKAGES_UPDATE,
                PRODUCT_PROVIDER_PACKAGE_SET_SIZE,
              ])}
            />
          )}
        </FormField>
      </GridColumn>
    </div>
  );
};

export default PackagingForm;
