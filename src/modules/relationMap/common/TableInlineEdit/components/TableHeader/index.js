// @flow
import * as React from 'react';
import { ToggleInput } from 'components/Form';
import { uuid } from 'utils/id';
import { WrapperHeaderStyle, TitleStyle, HeaderStyle } from './style';

type Props = {
  entity: string,
  showAll: boolean,
  hideColumns: Array<string>,
  templateColumns: Array<string>,
  onToggle: string => void,
  info: Array<{
    group: string,
    columns: Array<string | React.Node>,
  }>,
};

function isHidenColumn({
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
    group: string,
    columns: Array<string | React.Node>,
  }>,
  position: number,
  templateColumns: Array<string>,
}) {
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
    group: string,
    columns: Array<string | React.Node>,
  }>,
  templateColumns: Array<string>,
}) {
  return columns.some(
    (column, position) =>
      !isHidenColumn({
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
    <div className={WrapperHeaderStyle}>
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
          <div key={group}>
            <h3 className={TitleStyle}> {group} </h3>
            <div className={WrapperHeaderStyle}>
              {columns.map((column, position) =>
                isHidenColumn({
                  showAll,
                  hideColumns,
                  entity,
                  index,
                  info,
                  position,
                  templateColumns,
                }) ? null : (
                  <p key={uuid()} className={HeaderStyle}>
                    <ToggleInput
                      toggled={
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
                    >
                      {column}
                    </ToggleInput>
                  </p>
                )
              )}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
