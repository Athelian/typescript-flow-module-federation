// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import memoize from 'memoize-one';
import type { Milestone } from 'generated/graphql';
import { PROJECT_UPDATE, PROJECT_SET_MILESTONES } from 'modules/permission/constants/project';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { ProjectMilestonesContainer } from 'modules/project/form/containers';
import Board from './components/Board';

type MilestoneMap = {
  [key: string]: Milestone,
};

const createMilestoneColumnsData = memoize((milestones: Array<Object>) => {
  return milestones.reduce(
    (previous: MilestoneMap, milestone: Milestone) => ({
      ...previous,
      [milestone.id]: milestone.tasks || [],
    }),
    {}
  );
});

export default function MilestonesSection() {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  return (
    <Subscribe to={[ProjectMilestonesContainer]}>
      {({ state: { milestones }, changeMilestoneOrdering, changeMilestones }) => {
        const initial = createMilestoneColumnsData(milestones);
        return (
          <Board
            columns={initial}
            ordered={Object.keys(initial)}
            withScrollableColumns
            onChangeOrdering={changeMilestoneOrdering}
            onChangeColumns={changeMilestones}
            editable={{
              createMilestone: hasPermission([PROJECT_UPDATE, PROJECT_SET_MILESTONES]),
            }}
          />
        );
      }}
    </Subscribe>
  );
}
