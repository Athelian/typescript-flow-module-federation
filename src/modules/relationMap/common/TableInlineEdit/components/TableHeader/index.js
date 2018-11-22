// @flow
import * as React from 'react';
import { ToggleInput } from 'components/Form';
import { uuid } from 'utils/id';
import { WrapperHeaderStyle, TitleStyle, HeaderStyle } from './style';

type Props = {
  entity: string,
  showAll: boolean,
  hideColumns: Array<number>,
  onToggle: string => void,
  info: Array<{
    group: string,
    columns: Array<string | React.Node>,
  }>,
};

export default function TableHeader({ entity, info, onToggle, hideColumns, showAll }: Props) {
  return (
    <div className={WrapperHeaderStyle}>
      {info.map(({ group, columns }, index) => (
        <div key={group}>
          <h3 className={TitleStyle}> {group} </h3>
          <div className={WrapperHeaderStyle}>
            {columns.map((column, position) =>
              !showAll &&
              hideColumns.includes(
                `${entity}-${index > 0 ? info[index - 1].columns.length + position : position}`
              ) ? null : (
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
      ))}
    </div>
  );
}
