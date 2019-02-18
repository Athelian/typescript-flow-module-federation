// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BATCH_CREATE, BATCH_UPDATE } from 'modules/permission/constants/batch';
import usePermission from 'hooks/usePermission';
import { TextInputFactory, NumberInputFactory, MetricInputFactory } from 'modules/form/factories';
import BatchFormContainer from 'modules/batch/form/container';
import { FormField, FormContainer } from 'modules/form';
import { CalculatorButtonStyle } from 'modules/form/helpers/numberInput/style';
import GridColumn from 'components/GridColumn';
import { ToggleInput } from 'components/Form';
import { getByPath } from 'utils/fp';
import { PackagingSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const PackagingSection = ({ isNew }: Props) => {
  const { hasPermission } = usePermission();
  const allowCreateOrUpdate = hasPermission(BATCH_CREATE) || hasPermission(BATCH_UPDATE);

  return (
    <div className={PackagingSectionWrapperStyle}>
      <Subscribe to={[BatchFormContainer]}>
        {({
          originalValues,
          state,
          setFieldValue,
          setFieldArrayValue,
          calculatePackageVolume,
          calculatePackageQuantity,
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
                        id="modules.Batches.packageName"
                        defaultMessage="PACKAGE NAME"
                      />
                    }
                    editable={allowCreateOrUpdate}
                  />
                )}
              </FormField>

              <FormField
                name="packageCapacity"
                initValue={values.packageCapacity}
                setFieldValue={setFieldValue}
              >
                {({ name, onBlur, ...inputHandlers }) => (
                  <Subscribe to={[FormContainer]}>
                    {({ setFieldTouched }) => (
                      <NumberInputFactory
                        name={name}
                        {...inputHandlers}
                        onBlur={evt => {
                          inputHandlers.onBlur(evt);
                          setFieldValue('packageCapacity', inputHandlers.value);
                          calculatePackageQuantity(setFieldTouched);
                        }}
                        isNew={isNew}
                        originalValue={originalValues[name]}
                        label={
                          <FormattedMessage
                            id="modules.Batches.packageCapacity"
                            defaultMessage="PACKAGE CAPACITY"
                          />
                        }
                        editable={allowCreateOrUpdate}
                      />
                    )}
                  </Subscribe>
                )}
              </FormField>

              <FormField
                name="packageQuantity"
                initValue={values.packageQuantity}
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
                        id="modules.Batches.packageQuantity"
                        defaultMessage="PACKAGE QUANTITY"
                      />
                    }
                    showAutoCalculateToggle={allowCreateOrUpdate}
                    autoCalculateIsToggled={values.autoCalculateBoolean}
                    onToggleAutoCalculate={() => (
                      <div className={CalculatorButtonStyle}>
                        <Subscribe to={[BatchFormContainer]}>
                          {({ state: batchFormState, triggerCalculatePackageQuantity }) => (
                            <ToggleInput
                              toggled={batchFormState.autoCalculatePackageQuantity}
                              onToggle={() => {
                                setFieldValue(
                                  'autoCalculatePackageQuantity',
                                  !batchFormState.autoCalculatePackageQuantity
                                );
                                if (!batchFormState.autoCalculatePackageQuantity) {
                                  triggerCalculatePackageQuantity();
                                }
                              }}
                            />
                          )}
                        </Subscribe>
                      </div>
                    )}
                    editable={allowCreateOrUpdate}
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
                    editable={allowCreateOrUpdate}
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
                    editable={allowCreateOrUpdate}
                    showCalculator
                    onCalculate={calculatePackageVolume}
                  />
                )}
              </FormField>

              <FormField
                name="packageSize.length"
                initValue={getByPath('packageSize.length', values)}
                setFieldValue={(field, value) => setFieldArrayValue('packageSize.length', value)}
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
                    editable={allowCreateOrUpdate}
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
                    editable={allowCreateOrUpdate}
                  />
                )}
              </FormField>

              <FormField
                name="packageSize.height"
                initValue={getByPath('packageSize.height', values)}
                setFieldValue={(field, value) => setFieldArrayValue('packageSize.height', value)}
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
                    editable={allowCreateOrUpdate}
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
