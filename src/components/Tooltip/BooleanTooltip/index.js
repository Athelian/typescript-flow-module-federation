// @flow
import * as React from 'react';
import Tooltip from '../BaseTooltip';
import { MessageWrapperStyle, BooleanWrapperStyle, MessageStyle } from './style';

type Props = {
  editable: boolean,
  value: boolean,
  messages: {
    editable: {
      on: React.Node | string,
      off: React.Node | string,
    },
    readonly: {
      on: React.Node | string,
      off: React.Node | string,
    },
  },
  children: React.Node,
};

const defaultMessages = {
  editable: {
    on: '',
    off: '',
  },
  readonly: {
    on: '',
    off: '',
  },
};

const defaultProps = {
  editable: false,
  value: false,
};

export default function BooleanTooltip({ editable, value, messages, children }: Props) {
  const mergedMessages = { ...defaultMessages, ...messages };

  const message = (
    <div>
      {editable ? (
        <>
          <div className={MessageWrapperStyle}>
            <div className={BooleanWrapperStyle(true)}>ON</div>
            <div className={MessageStyle}>{mergedMessages.editable.on}</div>
          </div>
          <div className={MessageWrapperStyle}>
            <div className={BooleanWrapperStyle(false)}>OFF</div>
            <div className={MessageStyle}>{mergedMessages.editable.off}</div>
          </div>
        </>
      ) : (
        <>{value ? mergedMessages.readonly.on : mergedMessages.readonly.off}</>
      )}
    </div>
  );

  return <Tooltip message={message}>{children}</Tooltip>;
}

BooleanTooltip.defaultProps = defaultProps;
