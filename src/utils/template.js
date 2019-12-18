// @flow
import type { Column } from 'components/DraggableColumn';
import type { ColumnConfig } from 'components/Sheet/SheetState/types';

export const convertMappingColumns = (columns: Array<ColumnConfig>) => {
  const groupBatchQuantityColumns = [
    'batch.quantity',
    'batch.producedQuantity',
    'batch.preShippedQuantity',
    'batch.shippedQuantity',
    'batch.postShippedQuantity',
    'batch.deliveredQuantity',
  ];
  const mappingColumns: Array<Column | Array<Column>> = [];
  let counter = 0;
  columns.forEach((column, index) => {
    if (groupBatchQuantityColumns.includes(column.key)) {
      if (counter < groupBatchQuantityColumns.length) {
        const quantityColumns = [];
        while (counter < groupBatchQuantityColumns.length) {
          quantityColumns.push({
            title: columns[index + counter].title,
            key: columns[index + counter].key,
            hidden: !!columns[index + counter].hidden,
          });
          counter += 1;
        }
        mappingColumns.push(quantityColumns);
      }
    } else {
      mappingColumns.push({
        title: column.title,
        key: column.key,
        hidden: !!column.hidden,
      });
    }
  });
  return mappingColumns;
};

export const flattenColumns = (columns: Array<Column | Array<Column>>) => {
  return (columns.flatMap(cols => (Array.isArray(cols) ? [...cols] : cols)): Array<Column>);
};
