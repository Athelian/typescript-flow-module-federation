/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Icon from 'components/Icon';
import BaseCard from 'components/Cards';
import { Overlay } from './cellRenderer';
import { OrderCard } from './helpers';

storiesOf('RelationMapV2', module).add('Overlay', () => (
  <BaseCard icon="ORDER" color="ORDER">
    <OrderCard>This is an order </OrderCard>
    <Overlay color="#EF4848" message="Test" icon={<Icon icon="EXCHANGE" />} />
  </BaseCard>
));
