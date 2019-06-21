/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { BooleanValue, ObjectValue } from 'react-values';
import SlideView from 'components/SlideView';
import ProjectAndMilestone from './index';

storiesOf('Selector/ProjectAndMilestone', module).add('with gray card', () => (
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
                <ProjectAndMilestone
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
                  onSelect={(selectedProject, selectedMilestone) => {
                    slideToggle(false);
                    set({
                      project: selectedProject,
                      milestone: selectedMilestone,
                    });
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
