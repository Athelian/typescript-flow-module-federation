/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import { ObjectValue } from 'react-values';
import StoryBookWrapper from 'components/StoryBookWrapper';

import TaskStatusInput from './index';

storiesOf('Button', module).add('Task Status Input', () => (
  <StoryBookWrapper>
    <IntlProvider>
      <ObjectValue defaultValue={{}}>
        {({ value, set }) => {
          return (
            <>
              <TaskStatusInput
                task={value}
                update={newValue => {
                  set(newValue);
                  console.log(newValue);
                }}
              />
            </>
          );
        }}
      </ObjectValue>
    </IntlProvider>
  </StoryBookWrapper>
));
