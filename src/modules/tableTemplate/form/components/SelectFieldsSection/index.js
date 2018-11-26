// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
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

const TableTemplateSection = () => (
  <div className={ContentWrapperStyle}>
    <GridColumn>
      <Subscribe to={[TemplateFormContainer]}>
        {() =>
          orderColumns.map(({ group, columns }) => (
            <React.Fragment key={uuid()}>
              <h3> {group} </h3>
              <div>
                {columns.map(column => (
                  <p key={uuid()}>{column}</p>
                ))}
              </div>
            </React.Fragment>
          ))
        }
      </Subscribe>
    </GridColumn>
    <GridColumn>
      <Subscribe to={[TemplateFormContainer]}>
        {() =>
          orderItemColumns.map(({ group, columns }) => (
            <React.Fragment key={uuid()}>
              <h3> {group} </h3>
              <div>
                {columns.map(column => (
                  <p key={uuid()}>{column}</p>
                ))}
              </div>
            </React.Fragment>
          ))
        }
      </Subscribe>
    </GridColumn>
    <GridColumn>
      <Subscribe to={[TemplateFormContainer]}>
        {() =>
          batchColumns.map(({ group, columns }) => (
            <React.Fragment key={uuid()}>
              <h3> {group} </h3>
              <div>
                {columns.map(column => (
                  <p key={uuid()}>{column}</p>
                ))}
              </div>
            </React.Fragment>
          ))
        }
      </Subscribe>
    </GridColumn>
    <GridColumn>
      <Subscribe to={[TemplateFormContainer]}>
        {() =>
          shipmentColumns.map(({ group, columns }) => (
            <React.Fragment key={uuid()}>
              <h3> {group} </h3>
              <div>
                {columns.map(column => (
                  <p key={uuid()}>{column}</p>
                ))}
              </div>
            </React.Fragment>
          ))
        }
      </Subscribe>
    </GridColumn>
  </div>
);

export default TableTemplateSection;
