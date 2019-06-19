import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import ProjectCard from '../index';

describe('Cards', () => {
  test('render ProjectCard', () => {
    const project = {
      name: 'PROJECT TITLE',
      dueDate: '2019-6-30',
      taskCount: {
        count: 20,
        remain: 1,
        inProgress: 2,
        completed: 2,
        rejected: 2,
        approved: 2,
        delayed: 2,
      },
      tags: [
        { id: 1, name: 'tag1', color: '#123456' },
        { id: 2, name: 'tag2', color: '#FF00FF' },
        { id: 3, name: 'tag2', color: '#FF00FF' },
        { id: 4, name: 'tag2', color: '#FF00FF' },
        { id: 5, name: 'tag2', color: '#FF00FF' },
      ],
    };
    const { container, asFragment } = render(
      <IntlProvider locale="en">
        <ProjectCard project={project} />
      </IntlProvider>
    );

    expect(container.firstChild).toMatchSnapshot();
    expect(asFragment()).toMatchSnapshot();
  });
});
