// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import memoize from 'memoize-one';
import type { Milestone } from 'generated/graphql';
import { PROJECT_UPDATE, PROJECT_SET_MILESTONES } from 'modules/permission/constants/project';
import { MILESTONE_SET_TASKS } from 'modules/permission/constants/milestone';
import { TASK_SET_MILESTONE } from 'modules/permission/constants/task';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import useUser from 'hooks/useUser';
import useSortAndFilter from 'hooks/useSortAndFilter';
import messages from 'modules/task/messages';
import { ProjectInfoContainer, ProjectMilestonesContainer } from 'modules/project/form/containers';
import FilterToolBar from 'components/common/FilterToolBar';
import { calculateMilestonesEstimatedCompletionDate } from 'utils/project';
import { EstimatedCompletionDateContext } from 'modules/project/form/helpers';
import { uuid } from 'utils/id';
import { isForbidden } from 'utils/data';
import Board from './components/Board';
import { NavbarStyle } from './style';

type MilestoneMap = {
  [key: string]: Milestone,
};

const createMilestoneColumnsData = memoize((milestones: Array<Object>) => {
  return milestones.reduce((previous: MilestoneMap, milestone: Milestone) => {
    // forbidden items dont have an id
    // we add a dummy id as draggable library requires an id
    const validatedTasks = milestone.tasks.map(task => {
      if (isForbidden(task)) {
        task.id = uuid(); // eslint-disable-line no-param-reassign
      }

      return task;
    });

    return {
      ...previous,
      [milestone.id]: validatedTasks,
    };
  }, {});
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
      field: 'default',
      direction: 'DESCENDING',
    },
    perPage: 10,
    page: 1,
  };
  return state;
};

function MilestonesSection({ intl }: Props) {
  const { isOwner } = usePartnerPermission();
  const { user } = useUser();
  const { hasPermission } = usePermission(isOwner);

  const sortFields = [
    { title: intl.formatMessage(messages.default), value: 'default' },
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.name), value: 'name' },
    { title: intl.formatMessage(messages.startDate), value: 'startDate' },
    { title: intl.formatMessage(messages.dueDate), value: 'dueDate' },
    { title: intl.formatMessage(messages.entity), value: 'entity' },
  ];

  const { filterAndSort, onChangeFilter } = useSortAndFilter(getInitFilter());
  return (
    <>
      <div className={NavbarStyle}>
        <FilterToolBar
          icon="MILESTONE"
          sortFields={sortFields}
          filtersAndSort={filterAndSort}
          onChange={onChangeFilter}
        />
      </div>

      <Subscribe to={[ProjectMilestonesContainer, ProjectInfoContainer]}>
        {(
          {
            state: { milestones },
            changeMilestoneOrdering,
            changeMilestones,
            updateTask,
            removeTask,
          },
          { state: { dueDate } }
        ) => {
          const tasksByMilestoneId = createMilestoneColumnsData(milestones);
          const estimatedCompletionDates = calculateMilestonesEstimatedCompletionDate(
            {
              milestones,
            },
            user.timezone
          );
          return (
            <EstimatedCompletionDateContext.Provider value={estimatedCompletionDates}>
              <Board
                projectInfo={{
                  dueDate,
                  milestones: milestones.map(item => ({ id: item.id, dueDate: item.dueDate })),
                }}
                allowDragAndDrop={filterAndSort.sort.field === 'default'}
                manualSort={filterAndSort.sort}
                columns={tasksByMilestoneId}
                ordered={Object.keys(tasksByMilestoneId)}
                onChangeOrdering={changeMilestoneOrdering}
                onChangeColumns={changeMilestones}
                onChangeTask={updateTask}
                onRemoveTask={removeTask}
                editable={{
                  milestoneColumnEditable: hasPermission([PROJECT_UPDATE, PROJECT_SET_MILESTONES]),
                  milestoneRowEditable:
                    hasPermission(PROJECT_UPDATE) ||
                    (hasPermission(MILESTONE_SET_TASKS) && hasPermission(TASK_SET_MILESTONE)),
                }}
              />
            </EstimatedCompletionDateContext.Provider>
          );
        }}
      </Subscribe>
    </>
  );
}

export default injectIntl(MilestonesSection);
