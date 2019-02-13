// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import ProductProviderContainer from 'modules/productProvider/form/container';
import { FormField } from 'modules/form';
import { TextInputFactory, NumberInputFactory, MetricInputFactory } from 'modules/form/factories';
import GridColumn from 'components/GridColumn';

import { getByPath } from 'utils/fp';
import { PermissionConsumer } from 'modules/permission';
import { PackagingSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const PackagingSection = ({ isNew }: Props) => (
  <PermissionConsumer>
    {hasPermission => {
      const canCreateOrUpdate =
        hasPermission('product.productProviders.create') ||
        hasPermission('product.productProviders.update');

      return (
        <div className={PackagingSectionWrapperStyle}>
          <Subscribe to={[ProductProviderContainer]}>
            {({
              originalValues,
              state,
              setFieldValue,
              setFieldArrayValue,
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
                        editable={canCreateOrUpdate}
                        placeholder="Please input a value"
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
                        originalValue={originalValues.unitPrice.amount}
                        label={
                          <FormattedMessage
                            id="modules.ProductProviders.packageCapacity"
                            defaultMessage="PACKAGE CAPACITY"
                          />
                        }
                        editable={canCreateOrUpdate}
                        placeholder="Please input a value"
                      />
                    )}
                  </FormField>

                  <FormField
                    name="packageGrossWeight"
                    initValue={getByPath('packageGrossWeight', values)}
                    setFieldValue={(field, value) =>
                      setFieldArrayValue('packageGrossWeight', value)
                    }
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
                        editable={canCreateOrUpdate}
                        placeholder="Please input a value"
                      />
                    )}
                  </FormField>

                  <FormField
                    name="packageVolume"
                    initValue={getByPath('packageVolume', values)}
                    setFieldValue={(field, value) => setFieldArrayValue('packageVolume', value)}
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
                        editable={canCreateOrUpdate}
                        placeholder="Please input a value"
                        showCalculator
                        onCalculate={calculatePackageVolume}
                      />
                    )}
                  </FormField>

                  <FormField
                    name="packageSize.length"
                    initValue={getByPath('packageSize.length', values)}
                    setFieldValue={(field, value) =>
                      setFieldArrayValue('packageSize.length', value)
                    }
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
                        editable={canCreateOrUpdate}
                        placeholder="Please input a value"
                      />
                    )}
                  </FormField>

                  <FormField
                    name="packageSize.width"
                    initValue={getByPath('packageSize.width', values)}
                    setFieldValue={(field, value) => setFieldArrayValue('packageSize.width', value)}
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
                        editable={canCreateOrUpdate}
                        placeholder="Please input a value"
                      />
                    )}
                  </FormField>

                  <FormField
                    name="packageSize.height"
                    initValue={getByPath('packageSize.height', values)}
                    setFieldValue={(field, value) =>
                      setFieldArrayValue('packageSize.height', value)
                    }
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
                        editable={canCreateOrUpdate}
                        placeholder="Please input a value"
                      />
                    )}
                  </FormField>
                </GridColumn>
              );
            }}
          </Subscribe>
        </div>
      );
    }}
  </PermissionConsumer>
);

export default PackagingSection;
