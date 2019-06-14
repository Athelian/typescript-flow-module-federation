// @flow
import * as React from 'react';
import {
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

type Props = {
  showAllColumn: boolean,
  templateColumns: Array<string>,
  onToggle: Function,
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
  showAllColumn,
  customColumns: {
    orderCustomFields,
    orderItemCustomFields,
    batchCustomFields,
    shipmentCustomFields,
    productCustomFields,
  },
  templateColumns,
  onToggle,
  innerRef,
}: Props) => {
  return (
    <div ref={innerRef} className={StickyStyle}>
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
