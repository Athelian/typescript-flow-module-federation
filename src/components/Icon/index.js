// @flow
import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconEnums from './enums';

type Props = {
  icon: string,
};

function Icon({ icon }: Props) {
  if (icon === 'PROJECT') {
    return <FontAwesomeIcon icon={IconEnums.TH_LIST} fixedWidth rotation={90} />;
  }
  return <FontAwesomeIcon icon={IconEnums[icon]} fixedWidth />;
}

export default Icon;
