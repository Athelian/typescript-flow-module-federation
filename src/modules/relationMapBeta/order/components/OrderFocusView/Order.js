// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import BaseCard from 'components/Cards';
import { RotateIcon } from 'modules/relationMap/common/ActionCard/style';
import { OrderCard, WrapperCard } from 'components/RelationMap';
import ActionCard, { Action } from 'modules/relationMap/common/ActionCard';
import type { OrderFocusProps as Props } from 'modules/relationMapBeta/order/type.js.flow';

export default function Order({ poNo, totalOrdered, totalBatched, totalShipped }: Props) {
  return (
    <BaseCard icon="ORDER" color="ORDER">
      <BooleanValue>
        {({ value: hovered, set: setToggle }) => (
          <WrapperCard onMouseEnter={() => setToggle(true)} onMouseLeave={() => setToggle(false)}>
            {/* NOTE: better naming for order card props */}
            <OrderCard
              order={{
                poNo,
                orderedQuantity: totalOrdered,
                batchedQuantity: totalBatched,
                shippedQuantity: totalShipped,
              }}
            />
            <ActionCard show={hovered}>
              {({ targetted, toggle }) => (
                <>
                  {/* NOTE: why need to send targetted and toggle to ACTION */}
                  <Action
                    icon="MAGIC"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() => console.warn('HIGHLIGHT')}
                  />
                  <Action
                    icon="DOCUMENT"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() => console.warn('EDIT')}
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
