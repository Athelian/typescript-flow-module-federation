import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
// action

import GrayCard from './index';

storiesOf('GrayCard', module).add('default', () => <GrayCard width="400px" height="400px" />);
