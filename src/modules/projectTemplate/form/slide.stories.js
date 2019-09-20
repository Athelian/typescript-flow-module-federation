import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
// action
// import { action } from '@storybook/addon-actions';

import ProjectTemplateFormSlide from './index.slide';

storiesOf('project template', module).add('form page in slide', () => <ProjectTemplateFormSlide />);
