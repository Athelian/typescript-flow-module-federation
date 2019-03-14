// @flow
import * as React from 'react';
import { FormattedTime } from 'react-intl';
import type { LogFormatter } from 'modules/timeline/formatters';
import type { LogItem } from 'modules/timeline/types';
import { LogStyle, LogWrapperStyle, TimeStyle } from './style';

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

      <span className={LogStyle}>{formatter ? formatter.format(log) : log.translationKey}</span>
    </div>
  );
};

export default Log;
