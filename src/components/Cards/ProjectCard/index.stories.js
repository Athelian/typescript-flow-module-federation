import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
// action
// import { action } from '@storybook/addon-actions';
import ProjectCard from './index';

const milestone = {
  id: 1,
  name: 'Milestone A',
  isCompleted: false,
  completed: 0,
  total: 2,
  dueDate: '2020/04/05',
  estDate: '2020/04/25',
  completedAt: null,
};

const milestones = [
  {
    id: 2,
    name: 'milestone 1',
    isCompleted: true,
    completed: 2,
    total: 2,
    dueDate: '2020/01/05',
    completedAt: '2020/01/09',
  },
  {
    id: 3,
    name: 'milestone 2',
    isCompleted: false,
    completed: 1,
    total: 2,
    dueDate: '2020/02/05',
    completedAt: null,
    estData: '2020/02/02',
  },
  {
    id: 4,
    name: 'milestone 3',
    isCompleted: false,
    completed: 0,
    total: 2,
    dueDate: '2020/01/05',
    completedAt: '2020/01/03',
  },
  {
    id: 5,
    name: 'milestone 4',
    isCompleted: false,
    completed: 0,
    total: 2,
    dueDate: '2020/04/05',
    estDate: '2020/04/25',
  },
];

const project = {
  name: 'Project A',
  dueDate: '2020/04/20',
  tags: [
    {
      id: 1,
      name: 'Tag A',
      color: '#AAAAAA',
    },
    {
      id: 2,
      name: 'Tag B',
      color: '#EF4848',
    },
  ],
};

storiesOf('Card/ProjectCard', module)
  .add('1 Milestone', () => (
    <ProjectCard
      project={{
        ...project,
        milestones: [milestone],
      }}
    />
  ))
  .add('4 Milestones', () => (
    <ProjectCard
      project={{
        ...project,
        milestones,
      }}
    />
  ))
  .add('5 Milestones', () => (
    <ProjectCard
      project={{
        ...project,
        milestones: [...milestones, milestone],
      }}
    />
  ));
