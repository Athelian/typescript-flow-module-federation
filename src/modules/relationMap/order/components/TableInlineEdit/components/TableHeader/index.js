// @flow
import * as React from 'react';
import { intersection } from 'lodash';
import { CheckboxInput } from 'components/Form';
import { uuid } from 'utils/id';
import BatchQuantityHelper from './BatchQuantityHelper';
import {
  TableHeaderWrapperStyle,
  TableHeaderTitleStyle,
  TableHeaderGroupStyle,
  TableColumnHeaderStyle,
  TableColumnStyle,
} from './style';

type Props = {
  entity: string,
  showAll: boolean,
  templateColumns: Array<string>,
  onToggle: string => void,
  info: Array<{
    group: string | React.Node,
    availableColumns: Array<string>,
    columns: Array<string | React.Node>,
  }>,
};

function isHiddenColumn({
  showAll,
  fieldId,
  templateColumns,
}: {
  showAll: boolean,
  fieldId: string,
  templateColumns: Array<string>,
}) {
  return !showAll && !templateColumns.includes(fieldId);
}

export default function TableHeader({ entity, info, onToggle, templateColumns, showAll }: Props) {
  return (
    <>
      {info.map(({ group, columns, availableColumns }) =>
        intersection(templateColumns, availableColumns).length > 0 || showAll ? (
          <div key={uuid()} className={TableHeaderWrapperStyle}>
            <div className={TableHeaderTitleStyle(entity)}>{group}</div>
            <div className={TableHeaderGroupStyle}>
              {columns.map((column, position) => {
                const fieldId = availableColumns[position];
                return isHiddenColumn({
                  showAll,
                  fieldId,
                  templateColumns,
                }) ? null : (
                  <div key={uuid()} className={TableColumnHeaderStyle(entity)}>
                    {showAll && (
                      <CheckboxInput
                        checked={
                          templateColumns.length === 0 ? true : templateColumns.includes(fieldId)
                        }
                        onToggle={() => onToggle(fieldId)}
                      />
                    )}
                    <div className={TableColumnStyle}>{column}</div>
                    {fieldId.startsWith('batch.newQuantity') && <BatchQuantityHelper />}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null
      )}
    </>
  );
}
