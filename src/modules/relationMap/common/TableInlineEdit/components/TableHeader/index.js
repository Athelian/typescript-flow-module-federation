// @flow
import * as React from 'react';
import { WrapperHeaderStyle, TitleStyle, HeaderStyle } from './style';

type Props = {
  info: Array<{
    group: string,
    columns: Array<string>,
  }>,
};

export default function TableHeader({ info }: Props) {
  return (
    <div>
      {info.map(({ group, columns }) => (
        <React.Fragment key={group}>
          <h3 className={TitleStyle}> {group} </h3>
          <div className={WrapperHeaderStyle}>
            {columns.map(column => (
              <p className={HeaderStyle} key={column}>
                {column}
              </p>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
