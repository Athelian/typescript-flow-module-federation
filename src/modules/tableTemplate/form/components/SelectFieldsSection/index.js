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
  productColumns,
  containerColumns,
} from 'modules/tableTemplate/constants';
import { ContentWrapperStyle, FirstBlockStyle, SecondBlockStyle } from './style';

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
      }) => (
        <Subscribe to={[TemplateFormContainer]}>
          {({ hasSelectField, toggleSelectField }) => (
            <div className={ContentWrapperStyle}>
              <div className={FirstBlockStyle}>
                <GridColumn>
                  {renderGroup({
                    groups: orderColumns,
                    hasSelectField,
                    toggleSelectField,
                    editable: canCreateOrUpdate,
                  })}
                  {renderCustomFields({
                    customFields: orderCustomFields,
                    hasSelectField,
                    toggleSelectField,
                    editable: canCreateOrUpdate,
                  })}
                </GridColumn>
                <GridColumn>
                  {renderGroup({
                    groups: orderItemColumns,
                    hasSelectField,
                    toggleSelectField,
                    editable: canCreateOrUpdate,
                  })}
                  {renderCustomFields({
                    customFields: orderItemCustomFields,
                    hasSelectField,
                    toggleSelectField,
                    editable: canCreateOrUpdate,
                  })}
                </GridColumn>
                <GridColumn>
                  {renderGroup({
                    groups: batchColumns,
                    hasSelectField,
                    toggleSelectField,
                    editable: canCreateOrUpdate,
                  })}
                  {renderCustomFields({
                    customFields: batchCustomFields,
                    hasSelectField,
                    toggleSelectField,
                    editable: canCreateOrUpdate,
                  })}
                </GridColumn>
                <GridColumn>
                  {renderGroup({
                    groups: shipmentColumns,
                    hasSelectField,
                    toggleSelectField,
                    editable: canCreateOrUpdate,
                  })}
                  {renderCustomFields({
                    customFields: shipmentCustomFields,
                    hasSelectField,
                    toggleSelectField,
                    editable: canCreateOrUpdate,
                  })}
                </GridColumn>
              </div>
              <div className={SecondBlockStyle}>
                <GridColumn>
                  {renderGroup({
                    groups: productColumns,
                    hasSelectField,
                    toggleSelectField,
                    editable: canCreateOrUpdate,
                  })}
                  {renderCustomFields({
                    customFields: productCustomFields,
                    hasSelectField,
                    toggleSelectField,
                    editable: canCreateOrUpdate,
                  })}
                </GridColumn>
                <GridColumn>
                  {renderGroup({
                    groups: containerColumns,
                    hasSelectField,
                    toggleSelectField,
                    editable: canCreateOrUpdate,
                  })}
                </GridColumn>
              </div>
            </div>
          )}
        </Subscribe>
      )}
    />
  );
};

export default SelectFieldsSection;
