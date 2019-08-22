/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { BooleanValue } from 'react-values';
import MoveEntityConfirm from './index';

storiesOf('RelationMapV2', module).add('MoveEntityConfirm', () => (
  <BooleanValue>
    {({ value: isOpen, toggle }) => (
      <>
        <button type="button" onClick={toggle}>
          Show dialog
        </button>
        <MoveEntityConfirm
          isOpen={isOpen}
          from={{
            icon: 'BATCH',
            value: 'batch no 1',
          }}
          to={{
            icon: 'ORDER',
            value: 'order 1',
          }}
          onConfirm={toggle}
          onCancel={toggle}
        />
      </>
    )}
  </BooleanValue>
));
