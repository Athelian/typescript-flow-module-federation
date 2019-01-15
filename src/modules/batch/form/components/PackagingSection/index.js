// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import BatchFormContainer from 'modules/batch/form/container';
import { FormField } from 'modules/form';
import {
  textInputFactory,
  numberInputFactory,
  distanceInputFactory,
  weightInputFactory,
  volumeInputFactory,
} from 'modules/form/helpers';
import { CalculatorButtonStyle } from 'modules/form/helpers/numberInput/style';
import CalculatePackageQuantity from 'modules/batch/common/CalculatePackageQuantity';
import GridColumn from 'components/GridColumn';
import { ToggleInput } from 'components/Form';
import { getByPath } from 'utils/fp';
import { PackagingSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const PackagingSection = ({ isNew }: Props) => (
  <div className={PackagingSectionWrapperStyle}>
    <Subscribe to={[BatchFormContainer]}>
      {({
        originalValues,
        state,
        setFieldValue,
        setFieldArrayValue,
        calculatePackageVolume,
        calculatePackageQuantity,
        getPackageQuantity,
      }) => {
        const values = { ...originalValues, ...state };
        return (
          <GridColumn>
            <FormField
              name="packageName"
              initValue={values.packageName}
              setFieldValue={setFieldValue}
            >
              {({ name, ...inputHandlers }) =>
                textInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: originalValues[name],
                  label: (
                    <FormattedMessage
                      id="modules.Batches.packageName"
                      defaultMessage="PACKAGE NAME"
                    />
                  ),
                })
              }
            </FormField>

            <FormField
              name="packageCapacity"
              initValue={values.packageCapacity}
              setFieldValue={setFieldValue}
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: originalValues[name],
                  label: (
                    <FormattedMessage
                      id="modules.Batches.packageCapacity"
                      defaultMessage="PACKAGE CAPACITY"
                    />
                  ),
                })
              }
            </FormField>

            <CalculatePackageQuantity
              batch={values}
              setPackageQuantity={() =>
                setFieldValue('packageQuantity', getPackageQuantity(values))
              }
            >
              <FormField
                name="packageQuantity"
                initValue={values.packageQuantity}
                setFieldValue={setFieldValue}
              >
                {({ name, ...inputHandlers }) =>
                  numberInputFactory({
                    name,
                    inputHandlers,
                    isNew,
                    originalValue: originalValues[name],
                    label: (
                      <FormattedMessage
                        id="modules.Batches.packageQuantity"
                        defaultMessage="PACKAGE QUANTITY"
                      />
                    ),
                    calculate: calculatePackageQuantity,
                    renderCalculate: () => (
                      <div className={CalculatorButtonStyle}>
                        <Subscribe to={[BatchFormContainer]}>
                          {({ state: batchFormState }) => (
                            <ToggleInput
                              toggled={batchFormState.autoCalculatePackageQuantity}
                              onToggle={() =>
                                setFieldValue(
                                  'autoCalculatePackageQuantity',
                                  !batchFormState.autoCalculatePackageQuantity
                                )
                              }
                            />
                          )}
                        </Subscribe>
                      </div>
                    ),
                  })
                }
              </FormField>
            </CalculatePackageQuantity>
            <FormField
              name="packageGrossWeight"
              initValue={getByPath('packageGrossWeight', values)}
              setFieldValue={(field, value) => setFieldArrayValue('packageGrossWeight', value)}
            >
              {({ name, ...inputHandlers }) =>
                weightInputFactory({
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('packageGrossWeight', originalValues),
                  label: (
                    <FormattedMessage
                      id="modules.Batches.pkgGrossWeight"
                      defaultMessage="PKG GROSS WEIGHT"
                    />
                  ),
                })
              }
            </FormField>

            <FormField
              name="packageVolume"
              initValue={getByPath('packageVolume', values)}
              setFieldValue={(field, value) => setFieldArrayValue('packageVolume', value)}
            >
              {({ name, ...inputHandlers }) =>
                volumeInputFactory({
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('packageVolume', originalValues),
                  label: (
                    <FormattedMessage id="modules.Batches.pkgVolume" defaultMessage="PKG VOLUME" />
                  ),
                  calculate: calculatePackageVolume,
                })
              }
            </FormField>

            <FormField
              name="packageSize.length"
              initValue={getByPath('packageSize.length', values)}
              setFieldValue={(field, value) => setFieldArrayValue('packageSize.length', value)}
            >
              {({ ...inputHandlers }) =>
                distanceInputFactory({
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('packageSize.length', originalValues),
                  label: (
                    <FormattedMessage id="modules.Batches.pkgLength" defaultMessage="PKG LENGTH" />
                  ),
                })
              }
            </FormField>

            <FormField
              name="packageSize.width"
              initValue={getByPath('packageSize.width', values)}
              setFieldValue={(field, value) => setFieldArrayValue('packageSize.width', value)}
            >
              {({ ...inputHandlers }) =>
                distanceInputFactory({
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('packageSize.width', originalValues),
                  label: (
                    <FormattedMessage id="modules.Batches.pkgWidth" defaultMessage="PKG WIDTH" />
                  ),
                })
              }
            </FormField>

            <FormField
              name="packageSize.height"
              initValue={getByPath('packageSize.height', values)}
              setFieldValue={(field, value) => setFieldArrayValue('packageSize.height', value)}
            >
              {({ ...inputHandlers }) =>
                distanceInputFactory({
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('packageSize.height', originalValues),
                  label: (
                    <FormattedMessage id="modules.Batches.pkgHeight" defaultMessage="PKG HEIGHT" />
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

export default PackagingSection;
