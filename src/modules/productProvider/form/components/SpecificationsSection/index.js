// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import ProductProviderContainer from 'modules/productProvider/form/container';
import { FormField } from 'modules/form';
import {
  TextInputFactory,
  NumberInputFactory,
  EnumSearchSelectInputFactory,
  MetricInputFactory,
} from 'modules/form/factories';
import GridColumn from 'components/GridColumn';
import { PermissionConsumer } from 'modules/permission';
import { getByPath } from 'utils/fp';
import { SpecificationsSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const SpecificationsSection = ({ isNew }: Props) => (
  <PermissionConsumer>
    {hasPermission => {
      const canCreateOrUpdate =
        hasPermission('product.productProviders.create') ||
        hasPermission('product.productProviders.update');

      return (
        <div className={SpecificationsSectionWrapperStyle}>
          <Subscribe to={[ProductProviderContainer]}>
            {({
              originalValues,
              state,
              setFieldValue,
              setFieldArrayValue,
              calculateUnitVolume,
            }) => {
              const values = { ...originalValues, ...state };

              return (
                <GridColumn>
                  <FormField
                    name="unitType"
                    initValue={values.unitType}
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
                            id="modules.ProductProviders.unitType"
                            defaultMessage="UNIT TYPE"
                          />
                        }
                        editable={canCreateOrUpdate}
                        placeholder="Please input a value"
                      />
                    )}
                  </FormField>

                  <FormField
                    name="unitPrice.amount"
                    initValue={values.unitPrice.amount}
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
                            id="modules.ProductProviders.unitPrice"
                            defaultMessage="UNIT PRICE"
                          />
                        }
                        editable={canCreateOrUpdate}
                        placeholder="Please input a value"
                      />
                    )}
                  </FormField>

                  <FormField
                    name="unitPrice.currency"
                    initValue={values.unitPrice.currency}
                    setFieldValue={setFieldValue}
                  >
                    {({ name, ...inputHandlers }) => (
                      <EnumSearchSelectInputFactory
                        name={name}
                        {...inputHandlers}
                        isNew={isNew}
                        originalValue={originalValues.unitPrice.currency}
                        label={
                          <FormattedMessage
                            id="modules.ProductProviders.unitPriceCurrency"
                            defaultMessage="UNIT PRICE CURRENCY"
                          />
                        }
                        editable={canCreateOrUpdate}
                        placeholder="Please input a value"
                        enumType="Currency"
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
                        placeholder="Please input a value"
                      />
                    )}
                  </FormField>

                  <FormField
                    name="unitVolume"
                    initValue={getByPath('unitVolume', values)}
                    setFieldValue={(field, value) => setFieldArrayValue('unitVolume', value)}
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
                        placeholder="Please input a value"
                        showCalculator
                        onCalculate={calculateUnitVolume}
                      />
                    )}
                  </FormField>

                  <FormField
                    name="unitSize.length"
                    initValue={getByPath('unitSize.length', values)}
                    setFieldValue={(field, value) => setFieldArrayValue('unitSize.length', value)}
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
                        placeholder="Please input a value"
                      />
                    )}
                  </FormField>

                  <FormField
                    name="unitSize.width"
                    initValue={getByPath('unitSize.width', values)}
                    setFieldValue={(field, value) => setFieldArrayValue('unitSize.width', value)}
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
                        placeholder="Please input a value"
                      />
                    )}
                  </FormField>

                  <FormField
                    name="unitSize.height"
                    initValue={getByPath('unitSize.height', values)}
                    setFieldValue={(field, value) => setFieldArrayValue('unitSize.height', value)}
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

export default SpecificationsSection;
