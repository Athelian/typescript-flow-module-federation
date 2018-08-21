// @flow
import * as React from 'react';
import Tooltip from 'components/Tooltip';
import { LabelWrapperStyle, LabelStyle, TooltipStyle } from './style';

export type Props = {
  children: React.Node,
  title?: string | React.Node,
  required?: boolean,
  info?: string | React.Node,
  error?: string | React.Node,
  warning?: string | React.Node,
  hideLabel?: boolean,
  vertical?: boolean,
};

const Label = (props: Props) => {
  const { title, required, hideLabel, vertical, children, error, warning, info } = props;
  const showTooltip = (!hideLabel && !!error) || !!warning || !!info;
  const tooltipProps = { error, warning, info };
  return (
    <div className={LabelWrapperStyle(!!vertical)}>
      {!hideLabel && (
        <div className={LabelStyle}>
          {showTooltip && (
            <div className={TooltipStyle}>
              <Tooltip {...tooltipProps} />
            </div>
          )}
          {title || ''}
          {required ? ' *' : ''}
        </div>
      )}
      {children}
    </div>
  );
};

Label.defaultProps = {
  hideLabel: false,
  required: false,
  vertical: false,
  title: '',
  info: '',
  warning: '',
  error: '',
};

export default Label;
