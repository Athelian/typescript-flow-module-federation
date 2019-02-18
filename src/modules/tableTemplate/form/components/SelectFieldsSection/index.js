// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
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
}: {
  type: string,
  groups: Array<Object>,
  hasSelectField: Function,
  toggleSelectField: Function,
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
}: {
  type: string,
  customFields: Array<Object>,
  hasSelectField: Function,
  toggleSelectField: Function,
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

const TableTemplateSection = () => (
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
                })}
                {renderCustomFields({
                  type: 'ORDER',
                  customFields: orderCustomFields,
                  hasSelectField,
                  toggleSelectField,
                })}
              </GridColumn>
              <GridColumn>
                {renderGroup({
                  type: 'ORDER_ITEM',
                  groups: orderItemColumns,
                  hasSelectField,
                  toggleSelectField,
                })}
                {renderCustomFields({
                  type: 'ORDER_ITEM',
                  customFields: orderItemCustomFields,
                  hasSelectField,
                  toggleSelectField,
                })}
              </GridColumn>
              <GridColumn>
                {renderGroup({
                  type: 'BATCH',
                  groups: batchColumns,
                  hasSelectField,
                  toggleSelectField,
                })}
                {renderCustomFields({
                  type: 'BATCH',
                  customFields: batchCustomFields,
                  hasSelectField,
                  toggleSelectField,
                })}
              </GridColumn>
              <GridColumn>
                {renderGroup({
                  type: 'SHIPMENT',
                  groups: shipmentColumns,
                  hasSelectField,
                  toggleSelectField,
                })}
                {renderCustomFields({
                  type: 'SHIPMENT',
                  customFields: shipmentCustomFields,
                  hasSelectField,
                  toggleSelectField,
                })}
              </GridColumn>
            </>
          )}
        </Subscribe>
      </div>
    )}
  />
);

export default TableTemplateSection;
