// @flow
import * as React from 'react';
import faInfo from '@fortawesome/fontawesome-pro-solid/faInfoCircle';
import Tooltip from '../Tooltip';
import { InfoStyle, InfoButtonStyle } from './style';

type Props = {
  info: string | React.Node,
};

const InfoTooltip = ({ info }: Props) => (
  <Tooltip
    value={info}
    icon={faInfo}
    preShow={false}
    showDuration={200}
    tooltipStyle={InfoStyle}
    iconStyle={InfoButtonStyle}
  />
);

export default InfoTooltip;
