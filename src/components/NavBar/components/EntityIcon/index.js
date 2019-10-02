// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { IconStyle, SubIconStyle } from './style';

type OptionalProps = {
  invert: boolean,
  subIcon?: string,
};

type Props = OptionalProps & {
  icon: string,
  color: string,
};

const defaultProps = {
  invert: false,
};

function EntityIcon({ icon, color, invert, subIcon }: Props) {
  return (
    <div className={IconStyle(color, invert)}>
      <Icon icon={icon} />
      {subIcon && (
        <div className={SubIconStyle(color)}>
          <Icon icon={subIcon} />
        </div>
      )}
    </div>
  );
}

EntityIcon.defaultProps = defaultProps;

export default EntityIcon;
