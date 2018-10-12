// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { CardActionStyle } from './style';

type Props = {
  icon: string,
  hoverColor: string,
  onClick: () => void,
};

const defaultProps = {
  hoverColor: 'BLUE',
};

const CardAction = ({ icon, onClick, hoverColor }: Props) => (
  <button className={CardActionStyle(hoverColor)} onClick={onClick} type="button">
    <Icon icon={icon} />
  </button>
);

CardAction.defaultProps = defaultProps;

export default CardAction;
