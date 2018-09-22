/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import EntityType from './index';

storiesOf('EntityType', module).add('default', () => <EntityType name="test" />);
