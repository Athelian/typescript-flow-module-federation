// @flow
import * as React from 'react';
import { uuid } from 'utils/id';
import { WrapperHeaderStyle, TitleStyle, HeaderStyle } from './style';

type Props = {
  info: Array<{
    group: string,
    columns: Array<string | React.Node>,
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
              <p key={uuid()} className={HeaderStyle}>
                {column}
              </p>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
