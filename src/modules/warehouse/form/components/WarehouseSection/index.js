// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import useUser from 'hooks/useUser';
import { Subscribe } from 'unstated';
import FormattedNumber from 'components/FormattedNumber';
import { encodeId } from 'utils/id';
import {
  WAREHOUSE_UPDATE,
  WAREHOUSE_SET_CUSTOM_FIELDS,
  WAREHOUSE_SET_CUSTOM_FIELDS_MASK,
} from 'modules/permission/constants/warehouse';
import { STAFF_LIST } from 'modules/permission/constants/staff';
import { PARTNER_LIST } from 'modules/permission/constants/partner';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import WarehouseContainer from 'modules/warehouse/form/containers';
import validator from 'modules/warehouse/form/validator';
import SlideView from 'components/SlideView';
import { FormField } from 'modules/form';
import GridColumn from 'components/GridColumn';
import { CloneButton } from 'components/Buttons';
import { PartnerCard } from 'components/Cards';
import {
  FieldItem,
  FormTooltip,
  Label,
  SectionHeader,
  SectionWrapper,
  LastModified,
  TextInputFactory,
  EnumSearchSelectInputFactory,
  CustomFieldsFactory,
  UserAssignmentInputFactory,
  MetricInputFactory,
} from 'components/Form';
import { getByPath } from 'utils/fp';
import SelectPartners from '../SelectPartners';
import { WarehouseSectionWrapperStyle, MainFieldsWrapperStyle } from './style';
import { renderPartners } from './helpers';

type Props = {
  isNew: boolean,
};

const WarehouseSection = ({ isNew }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const { group } = useUser();
  const allowUpdate = hasPermission(WAREHOUSE_UPDATE);

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
              {!isNew && allowUpdate && isOwner && (
                <CloneButton
                  onClick={() => navigate(`/warehouse/clone/${encodeId(originalValues.id)}`)}
                />
              )}
            </SectionHeader>
            <div className={WarehouseSectionWrapperStyle}>
              <div className={MainFieldsWrapperStyle}>
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
                        editable={allowUpdate}
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
                        editable={allowUpdate}
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
                        editable={allowUpdate}
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
                          <FormattedMessage
                            id="modules.WareHouses.region"
                            defaultMessage="REGION"
                          />
                        }
                        editable={allowUpdate}
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
                        editable={allowUpdate}
                      />
                    )}
                  </FormField>

                  <FormField
                    name="country"
                    initValue={values.country}
                    setFieldValue={setFieldValue}
                  >
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
                        editable={allowUpdate}
                        enumType="Country"
                      />
                    )}
                  </FormField>

                  <FormField
                    name="surface"
                    initValue={getByPath('surface', values)}
                    setFieldValue={(field, value) => setFieldArrayValue('surface', value)}
                    values={values}
                  >
                    {({ name, ...inputHandlers }) => (
                      <MetricInputFactory
                        metricType="area"
                        name={name}
                        {...inputHandlers}
                        isNew={isNew}
                        originalValue={getByPath('surface', originalValues)}
                        label={
                          <FormattedMessage
                            id="modules.WareHouses.surfaceArea"
                            defaultMessage="SURFACE AREA"
                          />
                        }
                        editable={allowUpdate}
                      />
                    )}
                  </FormField>
                  <CustomFieldsFactory
                    entityType="Warehouse"
                    customFields={values.customFields}
                    setFieldValue={setFieldValue}
                    editable={{
                      values: hasPermission([WAREHOUSE_UPDATE, WAREHOUSE_SET_CUSTOM_FIELDS]),
                      mask: hasPermission([WAREHOUSE_UPDATE, WAREHOUSE_SET_CUSTOM_FIELDS_MASK]),
                    }}
                  />
                </GridColumn>
                <GridColumn>
                  <UserAssignmentInputFactory
                    name="inCharges"
                    values={values.inCharges}
                    onChange={(name: string, assignments: Array<Object>) =>
                      setFieldValue(name, assignments)
                    }
                    label={
                      <>
                        <FormattedMessage
                          id="modules.Warehouses.inCharge"
                          defaultMessage="IN CHARGE"
                        />
                        {' ('}
                        <FormattedNumber value={values.inCharges.length} />
                        {')'}
                      </>
                    }
                    infoMessage={
                      <FormattedMessage
                        id="modules.Warehouses.tooltipInCharge"
                        defaultMessage="You can choose up to 5 people in charge."
                      />
                    }
                    editable={hasPermission(STAFF_LIST) && allowUpdate}
                  />

                  <FieldItem
                    vertical
                    label={
                      <Label required>
                        <FormattedMessage id="modules.Warehouses.owner" defaultMessage="OWNER" />
                      </Label>
                    }
                    input={<PartnerCard partner={values.ownedBy || group} readOnly />}
                  />

                  <FieldItem
                    vertical
                    label={
                      <Label>
                        <FormattedMessage
                          id="modules.Warehouses.allowedToUse"
                          defaultMessage="AllOWED TO USE"
                        />
                        {' ('}
                        <FormattedNumber value={values.groups.length} />
                        {')'}
                      </Label>
                    }
                    tooltip={
                      <FormTooltip
                        infoMessage={
                          <FormattedMessage
                            id="modules.Warehouses.tooltipPartner"
                            defaultMessage="You can choose up to 4 Partners. This will allow them to use this Warehouse in their Shipments."
                          />
                        }
                      />
                    }
                    input={
                      <BooleanValue>
                        {({ value: opened, set: slideToggle }) => (
                          <>
                            <div
                              onClick={() =>
                                hasPermission(PARTNER_LIST) && allowUpdate
                                  ? slideToggle(true)
                                  : () => {}
                              }
                              role="presentation"
                            >
                              {renderPartners(values.groups, allowUpdate)}
                            </div>
                            <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                              {opened && (
                                <SelectPartners
                                  selected={values.groups}
                                  onCancel={() => slideToggle(false)}
                                  onSelect={selected => {
                                    slideToggle(false);
                                    setFieldValue('groups', selected);
                                  }}
                                />
                              )}
                            </SlideView>
                          </>
                        )}
                      </BooleanValue>
                    }
                  />
                </GridColumn>
              </div>
            </div>
          </SectionWrapper>
        );
      }}
    </Subscribe>
  );
};
export default WarehouseSection;
