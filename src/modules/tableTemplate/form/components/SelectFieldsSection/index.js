// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { ToggleInput } from 'components/Form';
import TemplateFormContainer from 'modules/tableTemplate/form/container';
import {
  orderColumns,
  orderItemColumns,
  batchColumns,
  shipmentColumns,
} from 'modules/tableTemplate/constants';
import { uuid } from 'utils/id';
import GridColumn from 'components/GridColumn';
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
          <ToggleInput
            toggled={hasSelectField()}
            onToggle={() =>
              toggleSelectField(
                `${type}-${index > 0 ? groups[index - 1].columns.length + position : position}`
              )
            }
          />
          {column}
        </div>
      ))}
    </React.Fragment>
  ));

const TableTemplateSection = () => (
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
          </GridColumn>
          <GridColumn>
            {renderGroup({
              type: 'ORDER_ITEM',
              groups: orderItemColumns,
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
          </GridColumn>
          <GridColumn>
            {renderGroup({
              type: 'SHIPMENT',
              groups: shipmentColumns,
              hasSelectField,
              toggleSelectField,
            })}
          </GridColumn>
        </>
      )}
    </Subscribe>
  </div>
);

export default TableTemplateSection;
