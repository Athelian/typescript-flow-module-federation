// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import WarehouseContainer from 'modules/warehouse/form/containers';
import validator from 'modules/warehouse/form/validator';
import { FormField } from 'modules/form';
import {
  textInputFactory,
  numberInputFactory,
  selectSearchEnumInputFactory,
} from 'modules/form/helpers';
import GridColumn from 'components/GridColumn';
import { DefaultSurfaceStyle } from 'components/Form';
import { getByPath } from 'utils/fp';
import { WarehouseSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const WarehouseSection = ({ isNew }: Props) => (
  <div className={WarehouseSectionWrapperStyle}>
    <Subscribe to={[WarehouseContainer]}>
      {({ originalValues, state, setFieldValue, setFieldArrayValue }) => {
        // $FlowFixMe
        const values = { ...originalValues, ...state };

        return (
          <GridColumn>
            <FormField
              name="name"
              initValue={values.name}
              validator={validator}
              setFieldValue={setFieldValue}
            >
              {({ name, ...inputHandlers }) =>
                textInputFactory({
                  inputHandlers,
                  name,
                  isNew,
                  required: true,
                  originalValue: originalValues[name],
                  label: <FormattedMessage id="modules.warehouse.name" defaultMessage="NAME" />,
                })
              }
            </FormField>

            <FormField name="street" initValue={values.street} setFieldValue={setFieldValue}>
              {({ name, ...inputHandlers }) =>
                textInputFactory({
                  inputHandlers,
                  name,
                  isNew,
                  originalValue: originalValues[name],
                  label: (
                    <FormattedMessage
                      id="modules.warehouse.streetAddress"
                      defaultMessage="STREET ADDRESS"
                    />
                  ),
                })
              }
            </FormField>

            <FormField name="locality" initValue={values.locality} setFieldValue={setFieldValue}>
              {({ name, ...inputHandlers }) =>
                textInputFactory({
                  inputHandlers,
                  name,
                  isNew,
                  originalValue: originalValues[name],
                  label: (
                    <FormattedMessage id="modules.warehouse.locality" defaultMessage="LOCALITY" />
                  ),
                })
              }
            </FormField>

            <FormField name="region" initValue={values.region} setFieldValue={setFieldValue}>
              {({ name, ...inputHandlers }) =>
                textInputFactory({
                  inputHandlers,
                  name,
                  isNew,
                  originalValue: originalValues[name],
                  label: <FormattedMessage id="modules.warehouse.region" defaultMessage="REGION" />,
                })
              }
            </FormField>

            <FormField
              name="postalCode"
              initValue={values.postalCode}
              setFieldValue={setFieldValue}
            >
              {({ name, ...inputHandlers }) =>
                textInputFactory({
                  inputHandlers,
                  name,
                  isNew,
                  originalValue: originalValues[name],
                  label: (
                    <FormattedMessage
                      id="modules.warehouse.postalCode"
                      defaultMessage="POSTAL CODE"
                    />
                  ),
                })
              }
            </FormField>

            <FormField name="country" initValue={values.country} setFieldValue={setFieldValue}>
              {({ name, ...inputHandlers }) =>
                selectSearchEnumInputFactory({
                  enumType: 'Country',
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: originalValues[name],
                  label: (
                    <FormattedMessage id="modules.warehouse.country" defaultMessage="COUNTRY" />
                  ),
                })
              }
            </FormField>

            <FormField
              name="surface"
              initValue={getByPath('surface.value', values)}
              setFieldValue={(field, value) =>
                setFieldArrayValue('surface', { value, metric: 'm²' })
              }
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  isNew,
                  name,
                  inputHandlers,
                  originalValue: getByPath('surface.value', originalValues),
                  label: (
                    <FormattedMessage
                      id="modules.warehouse.surfaceArea"
                      defaultMessage="SURFACE AREA"
                    />
                  ),
                  WrapperComponent: DefaultSurfaceStyle,
                })
              }
            </FormField>
          </GridColumn>
        );
      }}
    </Subscribe>
  </div>
);

export default WarehouseSection;
