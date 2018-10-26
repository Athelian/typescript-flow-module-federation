// @flow
import * as React from 'react';

import BaseFloatButton from './BaseFloatButton';
import { ButtonsWrapper } from './style';

type actionType = {
  icon: string,
  color: string,
  text: string,
};

type OptionalProps = {
  actions: Array<actionType>,
};

type Props = OptionalProps & {};

const defaultProps = {
  actions: [
    {
      icon: 'TARGET',
      color: 'TARGET',
      text: 'ALL TARGETS',
    },
    {
      icon: 'ENTITY',
      color: 'ENTITY',
      text: 'ALL ENTITIES',
    },
    {
      icon: 'ORDER',
      color: 'ORDER',
      text: 'ALL ORDERS',
    },
    {
      icon: 'ORDER_ITEM',
      color: 'ORDER_ITEM',
      text: 'ALL ITEMS',
    },
    {
      icon: 'BATCH',
      color: 'BATCH',
      text: 'ALL BATCHES',
    },
    {
      icon: 'SHIPMENT',
      color: 'SHIPMENT',
      text: 'ALL SHIPMENTS',
    },
  ],
};

const FloatMenu = (props: Props) => {
  const { actions } = props;

  return (
    <div className={ButtonsWrapper}>
      {actions &&
        actions.length &&
        actions.map((action: actionType) => {
          const { icon, color, text } = action;
          return (
            <BaseFloatButton icon={icon} color={color} key={icon}>
              <span>{text}</span>
            </BaseFloatButton>
          );
        })}
    </div>
  );
};

FloatMenu.defaultProps = defaultProps;

export default FloatMenu;
