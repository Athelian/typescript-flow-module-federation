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

const getFieldId = ({ entity, info, index, position }) =>
  `${entity}-${index > 0 ? info[index - 1].columns.length + position : position}`;

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

function shouldShowGroup({
  columns,
  showAll,
  entity,
  info,
  index,
  templateColumns,
}: {
  showAll: boolean,
  columns: Array<string | React.Node>,
  entity: string,
  index: number,
  info: Array<{
    group: string | React.Node,
    columns: Array<string | React.Node>,
  }>,
  templateColumns: Array<string>,
}) {
  return columns.some(
    (column, position) =>
      !isHiddenColumn({
        showAll,
        templateColumns,
        fieldId: getFieldId({
          entity,
          info,
          index,
          position,
        }),
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
                const fieldId = getFieldId({
                  entity,
                  info,
                  index,
                  position,
                });
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
