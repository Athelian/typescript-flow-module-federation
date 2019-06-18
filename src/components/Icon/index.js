// @flow
import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconEnums from './enums';

type Props = {
  icon: string,
};

function Icon({ icon, ...rest }: Props) {
  return <FontAwesomeIcon icon={IconEnums[icon]} fixedWidth {...rest} />;
}

export default Icon;
