// @flow
import * as React from 'react';
import { isEnableBetaFeature } from 'utils/env';
import {
  TimelineWarehouseNameWrapperStyle,
  TimelineWarehouseNameStyle,
  TimelineRemainContainerWrapperStyle,
} from './style';

type OptionalProps = {
  vertical: boolean,
  containers: Array<Object>,
};

type Props = OptionalProps & {
  name: ?string,
};

const defaultProps = {
  vertical: false,
  containers: [],
};

const TimelineWarehouseName = ({ name, vertical, containers }: Props) => (
  <div className={TimelineWarehouseNameWrapperStyle(vertical)}>
    <div className={TimelineWarehouseNameStyle}>{name}</div>

    {isEnableBetaFeature && containers.length > 1 && (
      <div className={TimelineRemainContainerWrapperStyle}>+{containers.length - 1}</div>
    )}
  </div>
);

TimelineWarehouseName.defaultProps = defaultProps;

export default TimelineWarehouseName;
