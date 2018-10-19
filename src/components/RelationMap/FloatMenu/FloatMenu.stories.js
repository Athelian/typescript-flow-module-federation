// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { css } from 'react-emotion';

import BaseFloatButton from './BaseFloatButton';

storiesOf('RelationMap/FloatMenu', module).add('BaseFloatButton (1 item)', () => {
  const StoryWrapper = css`
    width: 50%;
    position: relative;
  `;
  const ButtonsWrapper = css`
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: column;
  `;

  return (
    <div className={StoryWrapper}>
      <div className={ButtonsWrapper}>
        <BaseFloatButton icon="TARGET" color="TARGET">
          <span>ALL TARGETS</span>
        </BaseFloatButton>
        <BaseFloatButton icon="ENTITY" color="ENTITY">
          <span>ALL ENTITIES</span>
        </BaseFloatButton>
        <BaseFloatButton icon="ORDER" color="ORDER">
          <span>ALL ORDERS</span>
        </BaseFloatButton>
        <BaseFloatButton icon="ORDER_ITEM" color="ORDER_ITEM">
          <span>ALL ITEMS</span>
        </BaseFloatButton>
        <BaseFloatButton icon="BATCH" color="BATCH">
          <span>ALL BATCHES</span>
        </BaseFloatButton>
        <BaseFloatButton icon="SHIPMENT" color="SHIPMENT">
          <span>ALL SHIPMENTS</span>
        </BaseFloatButton>
      </div>
    </div>
  );
});
