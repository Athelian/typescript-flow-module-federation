// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  ContainerStyle,
  ProgressContainerStyle,
  ProgressStyle,
  StatusStyle,
  MessageStyle,
  ProgressValueStyle,
} from './style';
import messages from '../messages';

type Props = {
  status: string,
  progress: number,
  message: string | null,
};

const Progress = ({ status, progress, message }: Props) => {
  const ref = React.useRef(null);
  const [progressWidth, setProgressWidth] = React.useState(0);

  React.useEffect(() => {
    if (ref.current !== null) {
      setProgressWidth(ref.current.offsetWidth * (progress / 100));
    }
  }, [ref, progress]);

  return (
    <div className={ContainerStyle}>
      <h6 className={StatusStyle}>
        <FormattedMessage {...messages[status]} />
      </h6>
      <div ref={ref} className={ProgressContainerStyle}>
        <div className={ProgressStyle(progressWidth)} />
        <span className={ProgressValueStyle(progressWidth)}>{Math.round(progress)}%</span>
      </div>
      <span className={MessageStyle}>{message}</span>
    </div>
  );
};

export default Progress;
