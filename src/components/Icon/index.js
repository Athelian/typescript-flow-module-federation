// @flow
import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconEnums from './enums';

type Props = {
  icon: string,
};

function Icon({ icon }: Props) {
  let rotation = null;
  if (icon === 'PROJECT') {
    rotation = 90;
  }
  return <FontAwesomeIcon icon={IconEnums[icon]} fixedWidth {...(rotation ? { rotation } : {})} />;
}

export default Icon;
