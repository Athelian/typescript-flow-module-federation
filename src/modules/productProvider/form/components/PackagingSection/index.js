// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import ProductProviderContainer from 'modules/productProvider/form/container';
import { FormField } from 'modules/form';
import {
  textInputFactory,
  numberInputFactory,
  weightInputFactory,
  volumeInputFactory,
  distanceInputFactory,
} from 'modules/form/helpers';
import GridColumn from 'components/GridColumn';

import { getByPath } from 'utils/fp';
import { PackagingSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const PackagingSection = ({ isNew }: Props) => (
  <div className={PackagingSectionWrapperStyle}>
    <Subscribe to={[ProductProviderContainer]}>
      {({ originalValues, state, setFieldValue, setFieldArrayValue, calculatePackageVolume }) => {
        // $FlowFixMe
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
                      id="modules.ProductProviders.packageName"
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
                      id="modules.ProductProviders.packageCapacity"
                      defaultMessage="PACKAGE CAPACITY"
                    />
                  ),
                })
              }
            </FormField>

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
                      id="modules.ProductProviders.pkgCrossWeight"
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
                    <FormattedMessage
                      id="modules.ProductProviders.pkgVolume"
                      defaultMessage="PKG VOLUME"
                    />
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
              {({ name, ...inputHandlers }) =>
                distanceInputFactory({
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('packageSize.length', originalValues),
                  label: (
                    <FormattedMessage
                      id="modules.ProductProviders.pkgLength"
                      defaultMessage="PKG LENGTH"
                    />
                  ),
                })
              }
            </FormField>

            <FormField
              name="packageSize.width"
              initValue={getByPath('packageSize.width', values)}
              setFieldValue={(field, value) => setFieldArrayValue('packageSize.width', value)}
            >
              {({ name, ...inputHandlers }) =>
                distanceInputFactory({
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('packageSize.width', originalValues),
                  label: (
                    <FormattedMessage
                      id="modules.ProductProviders.pkgWidth"
                      defaultMessage="PKG WIDTH"
                    />
                  ),
                })
              }
            </FormField>

            <FormField
              name="packageSize.height"
              initValue={getByPath('packageSize.height', values)}
              setFieldValue={(field, value) => setFieldArrayValue('packageSize.height', value)}
            >
              {({ name, ...inputHandlers }) =>
                distanceInputFactory({
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('packageSize.height', originalValues),
                  label: (
                    <FormattedMessage
                      id="modules.ProductProviders.pkgHeight"
                      defaultMessage="PKG HEIGHT"
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

export default PackagingSection;
