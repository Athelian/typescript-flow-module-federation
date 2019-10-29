// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { splitEvery } from 'ramda';
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
  productColumns,
  containerColumns,
} from 'modules/tableTemplate/constants';
import orderSheetColumns from 'modules/order/sheet/columns';
import shipmentSheetColumns from 'modules/shipment/sheet/columns';
import { ContentWrapperStyle, BlockStyle } from './style';

const convertSheetColumns = sheetColumns =>
  Object.entries(
    sheetColumns.reduce(
      (groups, column) => ({
        ...groups,
        [column.icon]: [...(groups[column.icon] || []), column],
      }),
      {}
    )
  ).map(([key, columns]: [string, any]) => ({
    columns: [
      {
        id: 0,
        group: key,
        availableColumns: columns.map(col => col.key),
        columns: columns.map(col => col.title),
      },
    ],
  }));

const renderGroup = ({
  groups,
  hasSelectField,
  toggleSelectField,
  editable,
}: {
  groups: Array<Object>,
  hasSelectField: Function,
  toggleSelectField: Function,
  editable: boolean,
}) =>
  groups.map(({ id, group, columns, availableColumns }) => (
    <GridColumn gap="10px" key={id}>
      <Display align="left">{group}</Display>
      {columns.map((column, position) => {
        const fieldName = availableColumns[position];
        return (
          <div style={{ display: 'flex' }} key={fieldName}>
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
                  <Label>{column}</Label>
                </>
              )}
            </FormField>
          </div>
        );
      })}
    </GridColumn>
  ));

const renderCustomFields = ({
  customFields,
  hasSelectField,
  toggleSelectField,
  editable,
}: {
  customFields: Array<Object>,
  hasSelectField: Function,
  toggleSelectField: Function,
  editable: boolean,
}) => (
  <GridColumn gap="10px">
    <Display align="left">
      <FormattedMessage id="modules.tableTemplate.customFields" defaultMessage="CUSTOM FIELDS" />
    </Display>

    {customFields.map(({ id, name: text }) => {
      const fieldName = `customFields.${id}`;
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

const SelectFieldsSection = () => {
  const { hasPermission } = usePermission();
  const canCreateOrUpdate = hasPermission(TEMPLATE_CREATE) || hasPermission(TEMPLATE_UPDATE);
  return (
    <QueryForAllCustomFields
      render={({
        orderCustomFields,
        orderItemCustomFields,
        batchCustomFields,
        shipmentCustomFields,
        productCustomFields,
      }) => {
        const columnsByType = {
          Order: [
            { columns: orderColumns, customFields: orderCustomFields },
            { columns: orderItemColumns, customFields: orderItemCustomFields },
            { columns: batchColumns, customFields: batchCustomFields },
            { columns: shipmentColumns, customFields: shipmentCustomFields },
            { columns: productColumns, customFields: productCustomFields },
            { columns: containerColumns },
          ],
          OrderSheet: convertSheetColumns(orderSheetColumns),
          ShipmentSheet: convertSheetColumns(shipmentSheetColumns),
        };

        return (
          <Subscribe to={[TemplateFormContainer]}>
            {({ hasSelectField, toggleSelectField, state }) => (
              <div className={ContentWrapperStyle}>
                {splitEvery(4, columnsByType[state.type]).map((groups, blockIdx) => (
                  <div className={BlockStyle} key={`${blockIdx + 0}`}>
                    {groups.map(({ columns, customFields }, idx) => (
                      <GridColumn key={`${idx + 0}`}>
                        {renderGroup({
                          groups: columns,
                          hasSelectField,
                          toggleSelectField,
                          editable: canCreateOrUpdate,
                        })}
                        {customFields &&
                          renderCustomFields({
                            customFields,
                            hasSelectField,
                            toggleSelectField,
                            editable: canCreateOrUpdate,
                          })}
                      </GridColumn>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </Subscribe>
        );
      }}
    />
  );
};

export default SelectFieldsSection;
