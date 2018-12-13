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
  hideColumns: Array<string>,
  templateColumns: Array<string>,
  onToggle: string => void,
  info: Array<{
    group: string | React.Node,
    columns: Array<string | React.Node>,
  }>,
};

function isHiddenColumn({
  showAll,
  hideColumns,
  entity,
  index,
  info,
  position,
  templateColumns,
}: {
  showAll: boolean,
  hideColumns: Array<string>,
  entity: string,
  index: number,
  info: Array<{
    group: string | React.Node,
    columns: Array<string | React.Node>,
  }>,
  position: number,
  templateColumns: Array<string>,
}) {
  if (showAll) {
    return false;
  }
  if (templateColumns && templateColumns.length) {
    return (
      (!showAll &&
        hideColumns.includes(
          `${entity}-${index > 0 ? info[index - 1].columns.length + position : position}`
        )) ||
      !templateColumns.includes(
        `${entity}-${index > 0 ? info[index - 1].columns.length + position : position}`
      )
    );
  }
  return (
    !showAll &&
    hideColumns.includes(
      `${entity}-${index > 0 ? info[index - 1].columns.length + position : position}`
    )
  );
}

function shouldShowGroup({
  columns,
  showAll,
  hideColumns,
  entity,
  index,
  info,
  templateColumns,
}: {
  showAll: boolean,
  hideColumns: Array<string>,
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
        hideColumns,
        entity,
        index,
        info,
        position,
        templateColumns,
      })
  );
}

export default function TableHeader({
  entity,
  info,
  onToggle,
  hideColumns,
  templateColumns,
  showAll,
}: Props) {
  return (
    <>
      {info.map(({ group, columns }, index) =>
        shouldShowGroup({
          columns,
          showAll,
          hideColumns,
          entity,
          index,
          info,
          templateColumns,
        }) ? (
          <div key={uuid()} className={TableHeaderWrapperStyle}>
            <div className={TableHeaderTitleStyle(entity)}>{group}</div>
            <div className={TableHeaderGroupStyle}>
              {columns.map((column, position) =>
                isHiddenColumn({
                  showAll,
                  hideColumns,
                  entity,
                  index,
                  info,
                  position,
                  templateColumns,
                }) ? null : (
                  <div key={uuid()} className={TableColumnHeaderStyle(entity)}>
                    {showAll && (
                      <CheckboxInput
                        checked={
                          !hideColumns.includes(
                            `${entity}-${
                              index > 0 ? info[index - 1].columns.length + position : position
                            }`
                          )
                        }
                        onToggle={() =>
                          onToggle(
                            `${entity}-${
                              index > 0 ? info[index - 1].columns.length + position : position
                            }`
                          )
                        }
                      />
                    )}
                    <div className={TableColumnStyle}>{column}</div>
                  </div>
                )
              )}
            </div>
          </div>
        ) : null
      )}
    </>
  );
}
