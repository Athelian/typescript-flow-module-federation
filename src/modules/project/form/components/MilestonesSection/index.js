// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import type { Milestone } from 'generated/graphql';
import { ProjectMilestonesContainer } from 'modules/project/form/containers';
import Board from './components/Board';

type MilestoneMap = {
  [key: string]: Milestone,
};

export default function MilestonesSection() {
  return (
    <Subscribe to={[ProjectMilestonesContainer]}>
      {({ state: { milestones }, changeMilestoneOrdering, changeMilestones }) => {
        const initial = milestones.reduce(
          (previous: MilestoneMap, milestone: Milestone) => ({
            ...previous,
            [milestone.id]: milestone.tasks,
          }),
          {}
        );
        return (
          <Board
            columns={initial}
            ordered={Object.keys(initial)}
            withScrollableColumns
            onChangeOrdering={changeMilestoneOrdering}
            onChangeColumns={changeMilestones}
          />
        );
      }}
    </Subscribe>
  );
}
