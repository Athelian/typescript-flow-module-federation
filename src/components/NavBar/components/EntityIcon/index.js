// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { IconStyle } from './style';

type OptionalProps = {
  invert: boolean,
};

type Props = OptionalProps & {
  icon: string,
  color: string,
};

const defaultProps = {
  invert: false,
};

function EntityIcon({ icon, color, invert }: Props) {
  return (
    <div className={IconStyle(color, invert)}>
      <Icon icon={icon} />
    </div>
  );
}

EntityIcon.defaultProps = defaultProps;

export default EntityIcon;
