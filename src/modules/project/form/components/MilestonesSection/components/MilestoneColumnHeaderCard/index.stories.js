/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import MilestoneForm from './index';

storiesOf('Project/MilestoneForm', module).add('with default props', () => (
  <MilestoneForm provided={{}} milestoneId="" isDragging={false} />
));
