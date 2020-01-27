import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { ViewerContext } from 'contexts/Viewer';
import ProjectTemplateFormSlide from './index.slide';

storiesOf('project template', module).add('form page in slide', () => (
  <ViewerContext.Provider
    value={{
      authenticated: true,
      setAuthenticated: () => {},
      user: {},
      organization: {},
      notifications: {
        nodes: [],
      },
    }}
  >
    <ProjectTemplateFormSlide />{' '}
  </ViewerContext.Provider>
));
