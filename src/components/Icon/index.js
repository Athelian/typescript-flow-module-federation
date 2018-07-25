// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconEnums from './enums';

type Props = {
  icon: string,
};

function Icon({ icon }: Props) {
  return <FontAwesomeIcon icon={IconEnums[icon]} fixedWidth />;
}

export default Icon;
