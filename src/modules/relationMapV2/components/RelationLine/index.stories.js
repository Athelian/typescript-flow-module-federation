/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import RelationLine from './index';

storiesOf('RelationMapV2', module)
  .add('Vertical', () => (
    <div>
      Type VERTICAL: <RelationLine type="VERTICAL" />
    </div>
  ))
  .add('Vertical with targeting', () => (
    <div>
      Type VERTICAL: <RelationLine isTargeted type="VERTICAL" />
    </div>
  ))
  .add('Horizontal', () => (
    <div>
      Type VERTICAL: <RelationLine type="HORIZONTAL" />
    </div>
  ))
  .add('Horizontal with targeting', () => (
    <div>
      Type VERTICAL: <RelationLine isTargeted type="HORIZONTAL" />
    </div>
  ))
  .add('Horizontal with targeting and relation', () => (
    <div>
      Type VERTICAL: <RelationLine isTargeted hasRelation type="HORIZONTAL" />
    </div>
  ));
