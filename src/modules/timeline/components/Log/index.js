// @flow
import * as React from 'react';
import { FormattedTime } from 'react-intl';
import type { LogFormatter } from '../../formatters';
import type { UserInfo } from '../User';
import { LogStyle, LogWrapperStyle, TimeStyle } from './style';

export type LogItem = {
  id: string,
  translationKey: string,
  parameters: {
    [key: string]: any,
  },
  entity: {
    id: string,
  },
  createdAt: Date,
  createdBy: UserInfo,
};

type Props = {
  log: LogItem,
  formatters: Array<LogFormatter>,
};

const Log = ({ log, formatters }: Props) => {
  const formatter: ?LogFormatter = formatters.find((f: LogFormatter) =>
    f.support(log.translationKey)
  );

  return (
    <div className={LogWrapperStyle}>
      <span className={TimeStyle}>
        <FormattedTime value={log.createdAt} />
      </span>

      <span className={LogStyle}>
        {formatter
          ? formatter.format(log.translationKey, log.parameters, log.entity, log.createdBy)
          : log.translationKey}
      </span>
    </div>
  );
};

export default Log;
