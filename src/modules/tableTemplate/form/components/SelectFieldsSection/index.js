// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Query } from 'react-apollo';
import { Subscribe } from 'unstated';
import { getByPathWithDefault } from 'utils/fp';
import LoadingIcon from 'components/LoadingIcon';
import { ToggleInput } from 'components/Form';
import TemplateFormContainer from 'modules/tableTemplate/form/container';
import { FormField } from 'modules/form';
import {
  orderColumns,
  orderItemColumns,
  batchColumns,
  shipmentColumns,
} from 'modules/tableTemplate/constants';
import { uuid } from 'utils/id';
import GridColumn from 'components/GridColumn';
import { allFieldDefinitionsQuery } from './query';
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
  groups.map(({ group, columns }, index) => (
    <React.Fragment key={uuid()}>
      <h3> {group} </h3>
      {columns.map((column, position) => (
        <div style={{ display: 'flex' }} key={uuid()}>
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
                {name}
              </>
            )}
          </FormField>
        </div>
      ))}
    </React.Fragment>
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
  <div>
    <h3>
      <FormattedMessage id="modules.tableTemplate.customFields" defaultMessage="CUSTOM FIELDS" />
    </h3>

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
                {text}
              </>
            )}
          </FormField>
        </div>
      );
    })}
  </div>
);

const TableTemplateSection = () => (
  <Query query={allFieldDefinitionsQuery} fetchPolicy="network-only">
    {({ loading, error, data }) => {
      if (error) {
        if (error.message && error.message.includes('403')) {
          navigate('/403');
        }
        return error.message;
      }

      if (loading) return <LoadingIcon />;

      const orderCustomFields = getByPathWithDefault([], 'order', data);
      const orderItemCustomFields = getByPathWithDefault([], 'orderItem', data);
      const batchCustomFields = getByPathWithDefault([], 'batch', data);
      const shipmentCustomFields = getByPathWithDefault([], 'shipment', data);
      return (
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
      );
    }}
  </Query>
);

export default TableTemplateSection;
