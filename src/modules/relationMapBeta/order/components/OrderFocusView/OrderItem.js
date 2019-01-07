// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import BaseCard from 'components/Cards';
import { RotateIcon } from 'modules/relationMap/common/ActionCard/style';
import { OrderItemCard, WrapperCard } from 'components/RelationMap';
import ActionCard, { Action } from 'modules/relationMap/common/ActionCard';
import type { OrderItemProps } from 'modules/relationMapBeta/order/type.js.flow';

type OptionalProps = {
  wrapperClassName?: string,
};

type Props = OptionalProps & OrderItemProps;

export default function OrderItem({ wrapperClassName, ...orderItem }: Props) {
  return (
    <BaseCard icon="ORDER_ITEM" color="ORDER_ITEM" wrapperClassName={wrapperClassName}>
      <BooleanValue>
        {({ value: hovered, set: setToggle }) => (
          <WrapperCard onMouseEnter={() => setToggle(true)} onMouseLeave={() => setToggle(false)}>
            <OrderItemCard orderItem={orderItem} />
            <ActionCard show={hovered}>
              {({ targetted, toggle }) => (
                <>
                  <Action
                    icon="MAGIC"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() => console.warn('HIGHLIGHT')}
                  />
                  <Action
                    icon="BRANCH"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() => console.warn('BRANCH')}
                    className={RotateIcon}
                  />
                  <Action
                    icon="CHECKED"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() => console.warn('TARGET')}
                  />
                </>
              )}
            </ActionCard>
          </WrapperCard>
        )}
      </BooleanValue>
    </BaseCard>
  );
}
