import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';

import GrayCard from './index';

storiesOf('Card', module).add('GrayCard', () => <GrayCard width="400px" height="400px" />);
