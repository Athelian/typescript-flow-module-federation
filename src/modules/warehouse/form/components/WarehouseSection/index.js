// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import { Subscribe } from 'unstated';
import { WAREHOUSE_CREATE, WAREHOUSE_UPDATE } from 'modules/permission/constants/warehouse';
import usePermission from 'hooks/usePermission';
import WarehouseContainer from 'modules/warehouse/form/containers';
import validator from 'modules/warehouse/form/validator';
import { FormField } from 'modules/form';
import GridColumn from 'components/GridColumn';
import { CloneButton } from 'components/Buttons';
import {
  SectionHeader,
  SectionWrapper,
  LastModified,
  TextInputFactory,
  NumberInputFactory,
  EnumSearchSelectInputFactory,
  DefaultSurfaceStyle,
  CustomFieldsFactory,
} from 'components/Form';
import { getByPath } from 'utils/fp';
import { WarehouseSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const WarehouseSection = ({ isNew }: Props) => {
  const { hasPermission } = usePermission();
  const allowCreate = hasPermission(WAREHOUSE_CREATE);
  const allowUpdate = hasPermission(WAREHOUSE_UPDATE);
  const allowCreateOrUpdate = allowCreate || allowUpdate;

  return (
    <Subscribe to={[WarehouseContainer]}>
      {({ originalValues, state, setFieldValue, setFieldArrayValue }) => {
        const values = { ...originalValues, ...state };

        return (
          <SectionWrapper id="warehouse_warehouseSection">
            <SectionHeader
              icon="WAREHOUSE"
              title={
                <FormattedMessage id="modules.WareHouses.warehouse" defaultMessage="WAREHOUSE" />
              }
            >
              {!isNew && (
                <LastModified
                  updatedAt={originalValues.updatedAt}
                  updatedBy={originalValues.updatedBy}
                />
              )}
              {!isNew && allowUpdate && (
                <CloneButton
                  onClick={() => navigate(`/warehouse/clone/${encodeId(originalValues.id)}`)}
                />
              )}
            </SectionHeader>
            <div className={WarehouseSectionWrapperStyle}>
              <GridColumn>
                <FormField
                  name="name"
                  initValue={values.name}
                  validator={validator}
                  setFieldValue={setFieldValue}
                >
                  {({ name, ...inputHandlers }) => (
                    <TextInputFactory
                      name={name}
                      {...inputHandlers}
                      isNew={isNew}
                      required
                      originalValue={originalValues[name]}
                      label={
                        <FormattedMessage id="modules.WareHouses.name" defaultMessage="NAME" />
                      }
                      editable={allowCreateOrUpdate}
                    />
                  )}
                </FormField>

                <FormField name="street" initValue={values.street} setFieldValue={setFieldValue}>
                  {({ name, ...inputHandlers }) => (
                    <TextInputFactory
                      name={name}
                      {...inputHandlers}
                      isNew={isNew}
                      originalValue={originalValues[name]}
                      label={
                        <FormattedMessage
                          id="modules.WareHouses.streetAddress"
                          defaultMessage="STREET ADDRESS"
                        />
                      }
                      editable={allowCreateOrUpdate}
                    />
                  )}
                </FormField>

                <FormField
                  name="locality"
                  initValue={values.locality}
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
                          id="modules.WareHouses.locality"
                          defaultMessage="LOCALITY"
                        />
                      }
                      editable={allowCreateOrUpdate}
                    />
                  )}
                </FormField>

                <FormField name="region" initValue={values.region} setFieldValue={setFieldValue}>
                  {({ name, ...inputHandlers }) => (
                    <TextInputFactory
                      name={name}
                      {...inputHandlers}
                      isNew={isNew}
                      originalValue={originalValues[name]}
                      label={
                        <FormattedMessage id="modules.WareHouses.region" defaultMessage="REGION" />
                      }
                      editable={allowCreateOrUpdate}
                    />
                  )}
                </FormField>

                <FormField
                  name="postalCode"
                  initValue={values.postalCode}
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
                          id="modules.WareHouses.postalCode"
                          defaultMessage="POSTAL CODE"
                        />
                      }
                      editable={allowCreateOrUpdate}
                    />
                  )}
                </FormField>

                <FormField name="country" initValue={values.country} setFieldValue={setFieldValue}>
                  {({ name, ...inputHandlers }) => (
                    <EnumSearchSelectInputFactory
                      name={name}
                      {...inputHandlers}
                      isNew={isNew}
                      originalValue={originalValues[name]}
                      label={
                        <FormattedMessage
                          id="modules.WareHouses.country"
                          defaultMessage="COUNTRY"
                        />
                      }
                      editable={allowCreateOrUpdate}
                      enumType="Country"
                    />
                  )}
                </FormField>

                <FormField
                  name="surface"
                  initValue={getByPath('surface.value', values)}
                  setFieldValue={(field, value) =>
                    setFieldArrayValue('surface', { value, metric: 'm²' })
                  }
                >
                  {({ name, ...inputHandlers }) => (
                    <NumberInputFactory
                      name={name}
                      {...inputHandlers}
                      isNew={isNew}
                      originalValue={getByPath('surface.value', originalValues)}
                      label={
                        <FormattedMessage
                          id="modules.WareHouses.surfaceArea"
                          defaultMessage="SURFACE AREA"
                        />
                      }
                      WrapperComponent={DefaultSurfaceStyle}
                      editable={allowCreateOrUpdate}
                    />
                  )}
                </FormField>
                <CustomFieldsFactory
                  entityType="Warehouse"
                  customFields={values.customFields}
                  setFieldValue={setFieldValue}
                  editable={allowCreateOrUpdate}
                />
              </GridColumn>
            </div>
          </SectionWrapper>
        );
      }}
    </Subscribe>
  );
};
export default WarehouseSection;
