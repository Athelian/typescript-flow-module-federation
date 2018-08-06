// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { ButtonStyle } from './style';

type Props = {
  icon: string,
  hoverColor?: string,
  onClick: () => void,
};

function EntityAction({ icon, onClick, hoverColor = 'BLUE' }: Props) {
  return (
    <button className={ButtonStyle(hoverColor)} onClick={onClick} type="button">
      <Icon icon={icon} />
    </button>
  );
}

EntityAction.defaultProps = {
  hoverColor: 'BLUE',
};

export default EntityAction;
