// @flow
import * as React from 'react';
import { CheckboxInput } from 'components/Form';
import { uuid } from 'utils/id';
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
    columns: Array<string | React.Node>,
  }>,
};

function isHiddenColumn({
  showAll,
  fieldName,
  templateColumns,
}: {
  showAll: boolean,
  fieldName: string,
  templateColumns: Array<string>,
}) {
  return !showAll && !templateColumns.includes(fieldName);
}

function shouldShowGroup({
  columns,
  showAll,
  entity,
  templateColumns,
}: {
  showAll: boolean,
  columns: Array<string | React.Node>,
  entity: string,
  templateColumns: Array<string>,
}) {
  return columns.some(
    (column, position) =>
      !isHiddenColumn({
        showAll,
        templateColumns,
        fieldName: `${entity}-customFields-${position}`,
      })
  );
}

export default function TableHeader({ entity, info, onToggle, templateColumns, showAll }: Props) {
  return (
    <>
      {info.map(({ group, columns }, index) =>
        shouldShowGroup({
          columns,
          showAll,
          entity,
          index,
          info,
          templateColumns,
        }) ? (
          <div key={uuid()} className={TableHeaderWrapperStyle}>
            <div className={TableHeaderTitleStyle(entity)}>{group}</div>
            <div className={TableHeaderGroupStyle}>
              {columns.map((column, position) => {
                const fieldName = `${entity}-${position}`;
                return isHiddenColumn({
                  showAll,
                  fieldName,
                  templateColumns,
                }) ? null : (
                  <div key={uuid()} className={TableColumnHeaderStyle(entity)}>
                    {showAll && (
                      <CheckboxInput
                        checked={
                          templateColumns.length === 0 ? true : templateColumns.includes(fieldName)
                        }
                        onToggle={() => onToggle(fieldName)}
                      />
                    )}
                    <div className={TableColumnStyle}>{column}</div>
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
