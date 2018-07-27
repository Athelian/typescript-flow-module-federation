// @flow
import * as React from 'react';
import faError from '@fortawesome/fontawesome-pro-solid/faExclamationCircle';
import Tooltip from '../Tooltip';
import { ErrorButtonStyle, ErrorStyle } from './style';

type Props = {
  error: string | React.Node,
};

const ErrorTooltip = ({ error }: Props) => (
  <Tooltip
    value={error}
    icon={faError}
    preShow
    showDuration={2000}
    iconStyle={ErrorButtonStyle}
    tooltipStyle={ErrorStyle}
  />
);

export default ErrorTooltip;
