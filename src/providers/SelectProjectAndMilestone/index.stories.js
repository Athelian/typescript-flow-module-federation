/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { BooleanValue, ObjectValue } from 'react-values';
import SlideView from 'components/SlideView';
import SelectProjectAndMilestone from './index';

storiesOf('Selector/SelectProjectAndMilestone', module).add('with gray card', () => (
  <ObjectValue defaultValue={{}}>
    {({ value: { project, milestone }, set }) => (
      <BooleanValue>
        {({ value: isOpen, set: slideToggle }) => (
          <>
            <button onClick={() => slideToggle(true)} type="button">
              Click here to open selector
            </button>
            <p>Project</p>
            <pre>{JSON.stringify(project)}</pre>
            <p>milestone</p>
            <pre>{JSON.stringify(milestone)}</pre>
            <SlideView
              isOpen={isOpen}
              onRequestClose={() => {
                slideToggle(false);
                set({
                  project,
                  milestone,
                });
              }}
            >
              {isOpen && (
                <SelectProjectAndMilestone
                  filter={{
                    query: '',
                  }}
                  project={project}
                  milestone={milestone}
                  onCancel={() => {
                    slideToggle(false);
                    set({
                      project,
                      milestone,
                    });
                  }}
                  onSelect={value => {
                    slideToggle(false);
                    set(value);
                  }}
                />
              )}
            </SlideView>
          </>
        )}
      </BooleanValue>
    )}
  </ObjectValue>
));
