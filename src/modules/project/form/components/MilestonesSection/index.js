// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import memoize from 'memoize-one';
import type { Milestone } from 'generated/graphql';
import { PROJECT_UPDATE, PROJECT_SET_MILESTONES } from 'modules/permission/constants/project';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import useFilter from 'hooks/useFilter';
import messages from 'modules/task/messages';
import { ProjectMilestonesContainer } from 'modules/project/form/containers';
import FilterToolBar from 'components/common/FilterToolBar';
import Board from './components/Board';
import { NavbarStyle } from './style';

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

type Props = {
  intl: IntlShape,
};

const getInitFilter = () => {
  const state = {
    filter: {
      query: '',
    },
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
    perPage: 10,
    page: 1,
  };
  return state;
};

function MilestonesSection({ intl }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.name), value: 'name' },
    { title: intl.formatMessage(messages.startDate), value: 'startDate' },
    { title: intl.formatMessage(messages.dueDate), value: 'dueDate' },
    { title: intl.formatMessage(messages.entity), value: 'entity' },
  ];
  const { filterAndSort, onChangeFilter } = useFilter(getInitFilter(), 'filterMilestone');
  return (
    <>
      <div className={NavbarStyle}>
        <FilterToolBar
          icon="MILESTONE"
          sortFields={sortFields}
          filtersAndSort={filterAndSort}
          onChange={onChangeFilter}
          searchable={false}
        />
      </div>

      <Subscribe to={[ProjectMilestonesContainer]}>
        {({ state: { milestones }, changeMilestoneOrdering, changeMilestones }) => {
          const initial = createMilestoneColumnsData(milestones);
          return (
            <Board
              columns={initial}
              ordered={Object.keys(initial)}
              onChangeOrdering={changeMilestoneOrdering}
              onChangeColumns={changeMilestones}
              editable={{
                createMilestone: hasPermission([PROJECT_UPDATE, PROJECT_SET_MILESTONES]),
              }}
            />
          );
        }}
      </Subscribe>
    </>
  );
}

export default injectIntl(MilestonesSection);
