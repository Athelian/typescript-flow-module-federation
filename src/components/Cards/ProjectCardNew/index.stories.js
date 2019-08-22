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
};

const milestones = [
  {
    id: 2,
    name: 'milestone 1',
    isCompleted: false,
    completed: 0,
    total: 0,
    dueDate: '2020/01/05',
    completedAt: '2020/01/03',
  },
  {
    id: 3,
    name: 'milestone 2',
    completed: 0,
    total: 1,
    dueDate: '2020/01/05',
    completedAt: '2020/01/03',
  },
  {
    id: 4,
    name: 'milestone 3',
    completed: 1,
    total: 1,
    dueDate: '2020/01/05',
    completedAt: '2020/01/03',
  },
  {
    id: 5,
    name: 'milestone 4',
    isCompleted: true,
    completed: 1,
    total: 10,
    dueDate: '2020/01/05',
    completedAt: '2020/01/03',
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
        milestones: [...milestones],
      }}
    />
  ))
  .add('5 Milestones', () => (
    <ProjectCard
      project={{
        ...project,
        milestones: [milestone, ...milestones],
      }}
    />
  ));
