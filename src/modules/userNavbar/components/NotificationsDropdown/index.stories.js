/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import NotificationsDropdown from './index';

storiesOf('NotificationsDropdown', module).add('empty list', () => (
  <NotificationsDropdown isOpen />
));
