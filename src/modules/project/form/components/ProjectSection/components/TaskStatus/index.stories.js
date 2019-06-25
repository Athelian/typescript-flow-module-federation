/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import TaskStatus from './index';

storiesOf('Project/TaskStatus', module).add('with default props', () => <TaskStatus />);
