// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { Subscribe } from 'unstated';
import { PRODUCT_PROVIDER_GET } from 'modules/permission/constants/product';
import {
  BATCH_UPDATE,
  BATCH_SET_PACKAGE_NAME,
  BATCH_SET_PACKAGE_CAPACITY,
  BATCH_SET_PACKAGE_QUANTITY,
  BATCH_SET_PACKAGE_WEIGHT,
  BATCH_SET_PACKAGE_VOLUME,
  BATCH_SET_PACKAGE_SIZE,
} from 'modules/permission/constants/batch';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { SyncButton } from 'components/Buttons';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import BatchFormContainer from 'modules/batch/form/container';
import { FormField, FormContainer } from 'modules/form';
import GridColumn from 'components/GridColumn';
import {
  SectionHeader,
  SectionWrapper,
  TextInputFactory,
  NumberInputFactory,
  MetricInputFactory,
} from 'components/Form';
import { getByPath } from 'utils/fp';
import { PackagingSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const PackagingSection = ({ isNew }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const allowUpdate = hasPermission(BATCH_UPDATE);

  const allowSyncPackage =
    hasPermission(PRODUCT_PROVIDER_GET) &&
    (allowUpdate ||
      (hasPermission(BATCH_SET_PACKAGE_NAME) &&
        hasPermission(BATCH_SET_PACKAGE_CAPACITY) &&
        hasPermission(BATCH_SET_PACKAGE_QUANTITY) &&
        hasPermission(BATCH_SET_PACKAGE_WEIGHT) &&
        hasPermission(BATCH_SET_PACKAGE_VOLUME) &&
        hasPermission(BATCH_SET_PACKAGE_SIZE)));

  return (
    <SectionWrapper id="batch_packagingSection">
      <SectionHeader
        icon="PACKAGING"
        title={<FormattedMessage id="modules.Batches.packaging" defaultMessage="PACKAGING" />}
      >
        {allowSyncPackage && (
          <BooleanValue>
            {({ value: syncDialogIsOpen, set: dialogToggle }) => (
              <>
                <SyncButton onClick={() => dialogToggle(true)} />
                <Subscribe to={[BatchFormContainer, FormContainer]}>
                  {({ state, syncProductProvider }, { setFieldTouched }) => (
                    <>
                      <ConfirmDialog
                        isOpen={syncDialogIsOpen}
                        onRequestClose={() => dialogToggle(false)}
                        onCancel={() => dialogToggle(false)}
                        onConfirm={() => {
                          if (state.orderItem && state.orderItem.productProvider) {
                            syncProductProvider(state.orderItem.productProvider);
                            setFieldTouched('packageName');
                            setFieldTouched('packageCapacity');
                            setFieldTouched('packageQuantity');
                            setFieldTouched('packageGrossWeight');
                            setFieldTouched('packageVolume');
                            setFieldTouched('packageSize.length');
                            setFieldTouched('packageSize.width');
                            setFieldTouched('packageSize.height');
                          }
                          dialogToggle(false);
                        }}
                        message={
                          <FormattedMessage
                            id="modules.Batches.syncPackagingMessage"
                            defaultMessage="Are you sure sync the packaging?"
                          />
                        }
                      />
                    </>
                  )}
                </Subscribe>
              </>
            )}
          </BooleanValue>
        )}
      </SectionHeader>
      <div className={PackagingSectionWrapperStyle}>
        <Subscribe to={[BatchFormContainer]}>
          {({
            originalValues,
            state,
            setFieldValue,
            setFieldArrayValue,
            calculatePackageVolume,
            calculatePackageQuantity,
            triggerCalculatePackageQuantity,
          }) => {
            const values = { ...originalValues, ...state };
            return (
              <GridColumn>
                <FormField
                  name="packageName"
                  initValue={values.packageName}
                  setFieldValue={setFieldValue}
                  values={values}
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
                      editable={allowUpdate || hasPermission(BATCH_SET_PACKAGE_NAME)}
                    />
                  )}
                </FormField>

                <FormField
                  name="packageCapacity"
                  initValue={values.packageCapacity}
                  setFieldValue={setFieldValue}
                  values={values}
                >
                  {({ name, onBlur, ...inputHandlers }) => (
                    <Subscribe to={[FormContainer]}>
                      {({ setFieldTouched }) => (
                        <NumberInputFactory
                          name={name}
                          {...inputHandlers}
                          onBlur={evt => {
                            onBlur(evt);
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
                          editable={allowUpdate || hasPermission(BATCH_SET_PACKAGE_CAPACITY)}
                        />
                      )}
                    </Subscribe>
                  )}
                </FormField>

                <FormField
                  name="packageQuantity"
                  initValue={values.packageQuantity}
                  setFieldValue={setFieldValue}
                  values={values}
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
                      showAutoCalculateToggle={
                        allowUpdate || hasPermission(BATCH_SET_PACKAGE_QUANTITY)
                      }
                      autoCalculateIsToggled={values.autoCalculatePackageQuantity}
                      onToggleAutoCalculate={() => {
                        setFieldValue(
                          'autoCalculatePackageQuantity',
                          !values.autoCalculatePackageQuantity
                        );
                        if (!values.autoCalculatePackageQuantity) {
                          triggerCalculatePackageQuantity();
                        }
                      }}
                      editable={allowUpdate || hasPermission(BATCH_SET_PACKAGE_QUANTITY)}
                    />
                  )}
                </FormField>
                <FormField
                  name="packageGrossWeight"
                  initValue={getByPath('packageGrossWeight', values)}
                  setFieldValue={(field, value) => setFieldArrayValue('packageGrossWeight', value)}
                  values={values}
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
                      editable={allowUpdate || hasPermission(BATCH_SET_PACKAGE_WEIGHT)}
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
                      showCalculator={allowUpdate || hasPermission(BATCH_SET_PACKAGE_VOLUME)}
                      onCalculate={calculatePackageVolume}
                      editable={allowUpdate || hasPermission(BATCH_SET_PACKAGE_VOLUME)}
                    />
                  )}
                </FormField>

                <FormField
                  name="packageSize.length"
                  initValue={getByPath('packageSize.length', values)}
                  setFieldValue={(field, value) => setFieldArrayValue('packageSize.length', value)}
                  values={values}
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
                      editable={allowUpdate || hasPermission(BATCH_SET_PACKAGE_SIZE)}
                    />
                  )}
                </FormField>

                <FormField
                  name="packageSize.width"
                  initValue={getByPath('packageSize.width', values)}
                  setFieldValue={(field, value) => setFieldArrayValue('packageSize.width', value)}
                  values={values}
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
                      editable={allowUpdate || hasPermission(BATCH_SET_PACKAGE_SIZE)}
                    />
                  )}
                </FormField>

                <FormField
                  name="packageSize.height"
                  initValue={getByPath('packageSize.height', values)}
                  setFieldValue={(field, value) => setFieldArrayValue('packageSize.height', value)}
                  values={values}
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
                      editable={allowUpdate || hasPermission(BATCH_SET_PACKAGE_SIZE)}
                    />
                  )}
                </FormField>
              </GridColumn>
            );
          }}
        </Subscribe>
      </div>
    </SectionWrapper>
  );
};

export default PackagingSection;
