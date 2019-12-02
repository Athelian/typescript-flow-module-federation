// @flow
import * as React from 'react';
import {
  ValidationCardOverlayWrapperStyle,
  ValidationCardOverlayStyle,
  MessageStyle,
} from './style';

type Props = {|
  invalidMessage: React.Node,
  children: React.Node,
|};

function ValidationCardOverlay({ invalidMessage, children }: Props) {
  return (
    <div className={ValidationCardOverlayWrapperStyle}>
      {children}
      {invalidMessage && (
        <div className={ValidationCardOverlayStyle}>
          <div className={MessageStyle}>{invalidMessage}</div>
        </div>
      )}
    </div>
  );
}

export default ValidationCardOverlay;
