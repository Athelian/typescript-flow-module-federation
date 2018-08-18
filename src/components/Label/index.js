// @flow
import * as React from 'react';
import { WarningTooltip, InfoTooltip, ErrorTooltip } from 'components/Tooltips';
import { LabelWrapperStyle, LabelStyle } from './style';

export type Props = {
  children: React.Node,
  title?: string | React.Node,
  required?: boolean,
  info?: string | React.Node,
  error?: string | React.Node,
  warning?: string | React.Node,
  hideLabel?: boolean,
  horizontal?: boolean,
};

const Label = (props: Props) => {
  const { title, required, info, error, warning, hideLabel, horizontal, children } = props;
  return (
    <div className={LabelWrapperStyle(!!horizontal)}>
      {!hideLabel && error && <ErrorTooltip error={error} />}
      {!hideLabel && warning && <WarningTooltip warning={warning} />}
      {!hideLabel && info && <InfoTooltip error={info} />}
      {!hideLabel && (
        <div className={LabelStyle}>
          {title || ''} {required ? '*' : ''}
        </div>
      )}
      {children}
    </div>
  );
};

Label.defaultProps = {
  hideLabel: false,
  required: false,
  horizontal: true,
  title: '',
  info: '',
  warning: '',
  error: '',
};

export default Label;
