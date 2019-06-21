/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import TaskStatusChart from './index';

storiesOf('Chart', module).add('Task Status Chart', () => (
  <div
    style={{
      width: '195px',
      padding: '5px',
      display: 'grid',
      gridRowGap: 10,
    }}
  >
    <TaskStatusChart completed={9} inProgress={4} skipped={5} unCompleted={2} />
    <TaskStatusChart completed={0} inProgress={0} skipped={0} unCompleted={0} />
    <TaskStatusChart completed={1} inProgress={0} skipped={0} unCompleted={0} />
    <TaskStatusChart completed={0} inProgress={1} skipped={0} unCompleted={0} />
    <TaskStatusChart completed={0} inProgress={0} skipped={1} unCompleted={0} />
    <TaskStatusChart completed={0} inProgress={0} skipped={0} unCompleted={1} />
    <TaskStatusChart completed={0} inProgress={1} skipped={0} unCompleted={1} />
    <TaskStatusChart completed={4} inProgress={23} skipped={0} unCompleted={1} />
    <TaskStatusChart />
  </div>
));
