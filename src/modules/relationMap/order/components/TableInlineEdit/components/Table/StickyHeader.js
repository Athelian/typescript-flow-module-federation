// @flow
import * as React from 'react';
import {
  allColumnIds,
  batchColumns,
  containerColumns,
  orderColumns,
  orderItemColumns,
  productColumns,
  shipmentColumns,
} from 'modules/tableTemplate/constants';
import TableHeader from '../TableHeader';
import TableHeaderForCustomFields from '../TableHeaderForCustomFields';
import { StickyStyle } from './style';

const HEADER_SIZE = 50;

type Props = {
  columnCount: number,
  columnWidth: number,
  showAllColumn: boolean,
  customColumns: {
    orderCustomFields: Array<Object>,
    orderItemCustomFields: Array<Object>,
    batchCustomFields: Array<Object>,
    shipmentCustomFields: Array<Object>,
    productCustomFields: Array<Object>,
  },
  innerRef: React.Ref<any>,
};

export const StickyHeader = ({
  columnCount,
  columnWidth,
  showAllColumn,
  customColumns: {
    orderCustomFields,
    orderItemCustomFields,
    batchCustomFields,
    shipmentCustomFields,
    productCustomFields,
  },
  innerRef,
}: Props) => {
  const initTemplateColumn = window.localStorage.getItem('rmTemplateFilterColumns');
  const [templateColumns, setTemplateColumns] = React.useState(
    initTemplateColumn ? JSON.parse(initTemplateColumn) : [...allColumnIds]
  );
  const onToggle = React.useCallback(
    selectedColumn => {
      if (templateColumns && selectedColumn) {
        const filteredTemplateColumns = templateColumns.includes(selectedColumn)
          ? templateColumns.filter(item => item !== selectedColumn)
          : [...templateColumns, selectedColumn];
        setTemplateColumns(filteredTemplateColumns);
        window.localStorage.setItem(
          'rmTemplateFilterColumns',
          JSON.stringify(filteredTemplateColumns)
        );
      }
    },
    [templateColumns]
  );
  return (
    <div
      ref={innerRef}
      className={StickyStyle}
      style={{ height: HEADER_SIZE, width: columnCount * columnWidth }}
    >
      <TableHeader
        entity="ORDER"
        showAll={showAllColumn}
        info={orderColumns}
        templateColumns={templateColumns}
        onToggle={onToggle}
      />
      <TableHeaderForCustomFields
        entity="ORDER"
        customFields={orderCustomFields}
        onToggle={onToggle}
        showAll={showAllColumn}
        templateColumns={templateColumns}
      />
      <TableHeader
        entity="ORDER_ITEM"
        showAll={showAllColumn}
        info={orderItemColumns}
        templateColumns={templateColumns}
        onToggle={onToggle}
      />
      <TableHeaderForCustomFields
        entity="ORDER_ITEM"
        customFields={orderItemCustomFields}
        onToggle={onToggle}
        showAll={showAllColumn}
        templateColumns={templateColumns}
      />
      <TableHeader
        entity="BATCH"
        showAll={showAllColumn}
        info={batchColumns}
        templateColumns={templateColumns}
        onToggle={onToggle}
      />
      <TableHeaderForCustomFields
        entity="BATCH"
        customFields={batchCustomFields}
        onToggle={onToggle}
        showAll={showAllColumn}
        templateColumns={templateColumns}
      />
      <TableHeader
        entity="CONTAINER"
        showAll={showAllColumn}
        info={containerColumns}
        templateColumns={templateColumns}
        onToggle={onToggle}
      />
      <TableHeader
        entity="SHIPMENT"
        showAll={showAllColumn}
        info={shipmentColumns}
        templateColumns={templateColumns}
        onToggle={onToggle}
      />
      <TableHeaderForCustomFields
        entity="SHIPMENT"
        customFields={shipmentCustomFields}
        onToggle={onToggle}
        showAll={showAllColumn}
        templateColumns={templateColumns}
      />
      <TableHeader
        showAll={showAllColumn}
        entity="PRODUCT"
        info={productColumns}
        templateColumns={templateColumns}
        onToggle={onToggle}
      />
      <TableHeaderForCustomFields
        showAll={showAllColumn}
        entity="PRODUCT"
        customFields={productCustomFields}
        onToggle={onToggle}
        templateColumns={templateColumns}
      />
    </div>
  );
};

export default StickyHeader;
