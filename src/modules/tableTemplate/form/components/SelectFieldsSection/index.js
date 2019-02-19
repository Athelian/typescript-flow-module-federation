// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { TEMPLATE_CREATE, TEMPLATE_UPDATE } from 'modules/permission/constants/template';
import usePermission from 'hooks/usePermission';
import GridColumn from 'components/GridColumn';
import { ToggleInput, Display, Label } from 'components/Form';
import TemplateFormContainer from 'modules/tableTemplate/form/container';
import QueryForAllCustomFields from 'modules/tableTemplate/common/QueryForAllCustomFields';
import { FormField } from 'modules/form';
import {
  orderColumns,
  orderItemColumns,
  batchColumns,
  shipmentColumns,
} from 'modules/tableTemplate/constants';
import { ContentWrapperStyle } from './style';

const renderGroup = ({
  type,
  groups,
  hasSelectField,
  toggleSelectField,
  editable,
}: {
  type: string,
  groups: Array<Object>,
  hasSelectField: Function,
  toggleSelectField: Function,
  editable: boolean,
}) =>
  groups.map(({ id, group, columns }, index) => (
    <GridColumn gap="10px" key={id}>
      <Display align="left">{group}</Display>
      {columns.map((column, position) => (
        <div style={{ display: 'flex' }} key={column.name}>
          <FormField
            name={column}
            initValue={`${type}-${
              index > 0 ? groups[index - 1].columns.length + position : position
            }`}
          >
            {({ name, onBlur }) => (
              <>
                <ToggleInput
                  toggled={hasSelectField(
                    `${type}-${index > 0 ? groups[index - 1].columns.length + position : position}`
                  )}
                  onToggle={() => {
                    onBlur();
                    toggleSelectField(
                      `${type}-${
                        index > 0 ? groups[index - 1].columns.length + position : position
                      }`
                    );
                  }}
                  editable={editable}
                />
                <Label>{name}</Label>
              </>
            )}
          </FormField>
        </div>
      ))}
    </GridColumn>
  ));

const renderCustomFields = ({
  type,
  customFields,
  hasSelectField,
  toggleSelectField,
  editable,
}: {
  type: string,
  customFields: Array<Object>,
  hasSelectField: Function,
  toggleSelectField: Function,
  editable: boolean,
}) => (
  <GridColumn gap="10px">
    <Display align="left">
      <FormattedMessage id="modules.tableTemplate.customFields" defaultMessage="CUSTOM FIELDS" />
    </Display>

    {customFields.map(({ id, name: text }, index) => {
      const fieldName = `${type}-customFields-${index}`;
      return (
        <div style={{ display: 'flex' }} key={id}>
          <FormField name={fieldName} initValue={hasSelectField(fieldName)}>
            {({ onBlur }) => (
              <>
                <ToggleInput
                  toggled={hasSelectField(fieldName)}
                  onToggle={() => {
                    onBlur();
                    toggleSelectField(fieldName);
                  }}
                  editable={editable}
                />
                <Label>{text}</Label>
              </>
            )}
          </FormField>
        </div>
      );
    })}
  </GridColumn>
);

const TableTemplateSection = () => {
  const { hasPermission } = usePermission();
  const canCreateOrUpdate = hasPermission(TEMPLATE_CREATE) || hasPermission(TEMPLATE_UPDATE);
  return (
    <QueryForAllCustomFields
      render={({
        orderCustomFields,
        orderItemCustomFields,
        batchCustomFields,
        shipmentCustomFields,
      }) => (
        <div className={ContentWrapperStyle}>
          <Subscribe to={[TemplateFormContainer]}>
            {({ hasSelectField, toggleSelectField }) => (
              <>
                <GridColumn>
                  {renderGroup({
                    type: 'ORDER',
                    groups: orderColumns,
                    hasSelectField,
                    toggleSelectField,
                    editable: canCreateOrUpdate,
                  })}
                  {renderCustomFields({
                    type: 'ORDER',
                    customFields: orderCustomFields,
                    hasSelectField,
                    toggleSelectField,
                    editable: canCreateOrUpdate,
                  })}
                </GridColumn>
                <GridColumn>
                  {renderGroup({
                    type: 'ORDER_ITEM',
                    groups: orderItemColumns,
                    hasSelectField,
                    toggleSelectField,
                    editable: canCreateOrUpdate,
                  })}
                  {renderCustomFields({
                    type: 'ORDER_ITEM',
                    customFields: orderItemCustomFields,
                    hasSelectField,
                    toggleSelectField,
                    editable: canCreateOrUpdate,
                  })}
                </GridColumn>
                <GridColumn>
                  {renderGroup({
                    type: 'BATCH',
                    groups: batchColumns,
                    hasSelectField,
                    toggleSelectField,
                    editable: canCreateOrUpdate,
                  })}
                  {renderCustomFields({
                    type: 'BATCH',
                    customFields: batchCustomFields,
                    hasSelectField,
                    toggleSelectField,
                    editable: canCreateOrUpdate,
                  })}
                </GridColumn>
                <GridColumn>
                  {renderGroup({
                    type: 'SHIPMENT',
                    groups: shipmentColumns,
                    hasSelectField,
                    toggleSelectField,
                    editable: canCreateOrUpdate,
                  })}
                  {renderCustomFields({
                    type: 'SHIPMENT',
                    customFields: shipmentCustomFields,
                    hasSelectField,
                    toggleSelectField,
                    editable: canCreateOrUpdate,
                  })}
                </GridColumn>
              </>
            )}
          </Subscribe>
        </div>
      )}
    />
  );
};

export default TableTemplateSection;
