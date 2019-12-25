/* eslint-disable react/jsx-props-no-spreading */
// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { SortBy } from 'types';
import { getCache, setCache } from 'utils/cache';
import { colors } from 'styles/common';
import {
  useResizedColumns,
  useSortedColumns,
  type ColumnConfig,
  type ColumnState,
} from 'components/Sheet';
import { getColumnsConfigured, SHEET_COLUMN_KEY_PREFIX } from 'components/Sheet/useColumns';
import { ColumnWidths } from 'modules/sheet/common/columns';
import projectMessages from 'modules/project/messages';
import milestoneMessages from 'modules/milestone/messages';
import taskMessages from 'modules/task/messages';

export const ProjectSheetColumnGroups = ['PROJECT', 'MILESTONE_TASKS'];

export const projectColumns: Array<ColumnConfig> = [
  {
    key: 'project.created',
    title: <FormattedMessage {...projectMessages.createdAt} />,
    icon: 'PROJECT',
    color: colors.PROJECT,
    width: 110,
    sort: {
      name: 'createdAt',
      group: 'project',
    },
  },
  {
    key: 'project.updated',
    title: <FormattedMessage {...projectMessages.updatedAt} />,
    icon: 'PROJECT',
    color: colors.PROJECT,
    width: 110,
    sort: {
      default: true,
      name: 'updatedAt',
      group: 'project',
    },
  },
  {
    key: 'project.name',
    title: <FormattedMessage {...projectMessages.name} />,
    icon: 'PROJECT',
    color: colors.PROJECT,
    width: 200,
    sort: {
      name: 'name',
      group: 'project',
    },
  },
  {
    key: 'project.description',
    title: <FormattedMessage {...projectMessages.description} />,
    icon: 'PROJECT',
    color: colors.PROJECT,
    width: 200,
  },
  {
    key: 'project.dueDate',
    title: <FormattedMessage {...projectMessages.dueDate} />,
    icon: 'PROJECT',
    color: colors.PROJECT,
    width: 125,
    sort: {
      name: 'dueDate',
      group: 'project',
    },
  },
  {
    key: 'project.tags',
    title: <FormattedMessage {...projectMessages.tags} />,
    icon: 'PROJECT',
    color: colors.PROJECT,
    width: 200,
  },
  {
    key: 'project.logs',
    title: <FormattedMessage {...projectMessages.logs} />,
    icon: 'PROJECT',
    color: colors.PROJECT,
    width: 120,
  },
  // actions
];

export const milestoneColumns = (milestoneIdx: number | '#'): Array<ColumnConfig> => [
  {
    key: `milestones.${milestoneIdx}.created`,
    title: <FormattedMessage {...milestoneMessages.createdAt} />,
    icon: 'MILESTONE_TASK',
    color: colors.MILESTONE,
    width: ColumnWidths.DateUser,
  },
  {
    key: `milestones.${milestoneIdx}.updated`,
    title: <FormattedMessage {...milestoneMessages.updatedAt} />,
    icon: 'MILESTONE_TASK',
    color: colors.MILESTONE,
    width: ColumnWidths.DateUser,
  },
  {
    key: `milestones.${milestoneIdx}.name`,
    title: <FormattedMessage {...milestoneMessages.name} />,
    icon: 'MILESTONE_TASK',
    color: colors.MILESTONE,
    width: ColumnWidths.Default,
  },
  {
    key: `milestones.${milestoneIdx}.description`,
    title: <FormattedMessage {...milestoneMessages.description} />,
    icon: 'MILESTONE_TASK',
    color: colors.MILESTONE,
    width: ColumnWidths.Default,
  },
  // dueDate + binding
  // estimatedCompletionDate + binding
  {
    key: `milestones.${milestoneIdx}.status`,
    title: <FormattedMessage {...milestoneMessages.status} />,
    icon: 'MILESTONE_TASK',
    color: colors.MILESTONE,
    width: ColumnWidths.Select,
  },
  {
    key: `milestones.${milestoneIdx}.statusDate`,
    title: <FormattedMessage {...milestoneMessages.statusDate} />,
    icon: 'MILESTONE_TASK',
    color: colors.MILESTONE,
    width: ColumnWidths.Default,
  },
  {
    key: `milestones.${milestoneIdx}.files`,
    title: <FormattedMessage {...milestoneMessages.files} />,
    icon: 'MILESTONE_TASK',
    color: colors.MILESTONE,
    width: ColumnWidths.Default,
  },
  // actions
];

export const taskColumns = (
  milestoneIdx: number | '#',
  taskIdx: number | '#'
): Array<ColumnConfig> => [
  {
    key: `milestones.${milestoneIdx}.tasks.${taskIdx}.created`,
    title: <FormattedMessage {...taskMessages.createdAt} />,
    icon: 'MILESTONE_TASK',
    color: colors.TASK,
    width: 110,
  },
  {
    key: `milestones.${milestoneIdx}.tasks.${taskIdx}.updated`,
    title: <FormattedMessage {...taskMessages.updatedAt} />,
    icon: 'MILESTONE_TASK',
    color: colors.TASK,
    width: 110,
  },
  {
    key: `milestones.${milestoneIdx}.tasks.${taskIdx}.name`,
    title: <FormattedMessage {...taskMessages.name} />,
    icon: 'MILESTONE_TASK',
    color: colors.TASK,
    width: 200,
  },
  {
    key: `milestones.${milestoneIdx}.tasks.${taskIdx}.description`,
    title: <FormattedMessage {...taskMessages.description} />,
    icon: 'MILESTONE_TASK',
    color: colors.TASK,
    width: 200,
  },
  {
    key: `milestones.${milestoneIdx}.tasks.${taskIdx}.startDate`,
    title: <FormattedMessage {...taskMessages.startDate} />,
    icon: 'MILESTONE_TASK',
    color: colors.TASK,
    width: 630,
  },
  {
    key: `milestones.${milestoneIdx}.tasks.${taskIdx}.dueDate`,
    title: <FormattedMessage {...taskMessages.dueDate} />,
    icon: 'MILESTONE_TASK',
    color: colors.TASK,
    width: 630,
  },
  {
    key: `milestones.${milestoneIdx}.tasks.${taskIdx}.status`,
    title: <FormattedMessage {...taskMessages.status} />,
    icon: 'MILESTONE_TASK',
    color: colors.TASK,
    width: ColumnWidths.Select,
  },
  {
    key: `milestones.${milestoneIdx}.tasks.${taskIdx}.statusDate`,
    title: <FormattedMessage {...taskMessages.statusDate} />,
    icon: 'MILESTONE_TASK',
    color: colors.TASK,
    width: ColumnWidths.Default,
  },
  {
    key: `milestones.${milestoneIdx}.tasks.${taskIdx}.assignedTo`,
    title: <FormattedMessage {...taskMessages.assignedTo} />,
    icon: 'MILESTONE_TASK',
    color: colors.TASK,
    width: ColumnWidths.Users,
  },
  {
    key: `milestones.${milestoneIdx}.tasks.${taskIdx}.approvable`,
    title: <FormattedMessage {...taskMessages.approvable} />,
    icon: 'MILESTONE_TASK',
    color: colors.TASK,
    width: 200,
  },
  {
    key: `milestones.${milestoneIdx}.tasks.${taskIdx}.approvalStatus`,
    title: <FormattedMessage {...taskMessages.approvalStatus} />,
    icon: 'MILESTONE_TASK',
    color: colors.TASK,
    width: ColumnWidths.Select,
  },
  {
    key: `milestones.${milestoneIdx}.tasks.${taskIdx}.approvalStatusDate`,
    title: <FormattedMessage {...taskMessages.approvalStatusDate} />,
    icon: 'MILESTONE_TASK',
    color: colors.TASK,
    width: ColumnWidths.Default,
  },
  {
    key: `milestones.${milestoneIdx}.tasks.${taskIdx}.approvers`,
    title: <FormattedMessage {...taskMessages.approvers} />,
    icon: 'MILESTONE_TASK',
    color: colors.TASK,
    width: ColumnWidths.Users,
  },
  {
    key: `milestones.${milestoneIdx}.tasks.${taskIdx}.tags`,
    title: <FormattedMessage {...taskMessages.tags} />,
    icon: 'MILESTONE_TASK',
    color: colors.TASK,
    width: 200,
  },
  {
    key: `milestones.${milestoneIdx}.tasks.${taskIdx}.logs`,
    title: <FormattedMessage {...taskMessages.logs} />,
    icon: 'MILESTONE_TASK',
    color: colors.TASK,
    width: 120,
  },
  // actions
];

export function computeMilestoneTaskColumnsTemplate(
  columns: Array<ColumnConfig>
): {
  milestoneColumnsTemplate: Array<ColumnConfig>,
  milestoneCount: number,
  taskColumnsTemplate: Array<ColumnConfig>,
  taskCount: number,
} {
  const allMilestoneColumns = columns.filter(col => col.key.startsWith('milestones'));
  const firstMilestoneColumns = allMilestoneColumns.filter(col =>
    col.key.startsWith('milestones.0')
  );
  const firstTaskColumns = firstMilestoneColumns.filter(c =>
    c.key.startsWith('milestones.0.tasks.0')
  );

  const milestoneCount = allMilestoneColumns.reduce((set, col) => {
    const matches = col.key.match(/milestones\.(\d+)/);
    if (matches) {
      set.add(parseFloat(matches[1]));
    }

    return set;
  }, new Set([0])).size;

  const taskCount = firstMilestoneColumns.reduce((set, col) => {
    if (col.key.startsWith('milestones.0.tasks')) {
      const matches = col.key.match(/milestones\.0\.tasks\.(\d+)/);
      if (matches) {
        set.add(parseFloat(matches[1]));
      }
    }
    return set;
  }, new Set([0])).size;

  const milestoneColumnsTemplate = firstMilestoneColumns
    .filter(c => !c.key.startsWith('milestones.0.tasks'))
    .map(c => ({
      ...c,
      key: c.key.replace(/(\d+)/g, '#'),
    }));

  const taskColumnsTemplate = firstTaskColumns.map(c => ({
    ...c,
    key: c.key.replace(/(\d+)/g, '#'),
  }));

  return {
    milestoneColumnsTemplate,
    milestoneCount,
    taskColumnsTemplate,
    taskCount,
  };
}

export function generateMilestoneTaskColumns(
  milestoneColumnsTemplate: Array<ColumnConfig>,
  milestoneCount: number,
  taskColumnsTemplate: Array<ColumnConfig>,
  taskCount: number
): Array<ColumnConfig> {
  const columns = [];

  for (let milestoneIdx = 0; milestoneIdx < milestoneCount; milestoneIdx += 1) {
    const milestoneColumnsConfig = milestoneColumns(milestoneIdx);

    columns.push(
      ...milestoneColumnsTemplate.map(({ key, hidden }) => ({
        ...milestoneColumnsConfig.find(c => c.key.replace(/(\d+)/g, '#') === key),
        hidden,
      }))
    );

    for (let taskIdx = 0; taskIdx < taskCount; taskIdx += 1) {
      const taskColumnsConfig = taskColumns(milestoneIdx, taskIdx);

      columns.push(
        ...taskColumnsTemplate.map(({ key, hidden }) => ({
          ...taskColumnsConfig.find(c => c.key.replace(/(\d+)/g, '#') === key),
          hidden,
        }))
      );
    }
  }

  return columns;
}

export function computeProjectColumnConfigsFromTemplate(template: Object): Array<ColumnConfig> {
  const {
    milestoneColumnsTemplate,
    milestoneCount,
    taskColumnsTemplate,
    taskCount,
  } = computeMilestoneTaskColumnsTemplate(template.columns);

  return [
    ...getColumnsConfigured(
      projectColumns,
      template.columns.reduce(
        (object, item) => ({
          ...object,
          [item.key]: item.hidden,
        }),
        {}
      )
    ),
    ...generateMilestoneTaskColumns(
      getColumnsConfigured(
        milestoneColumns('#'),
        milestoneColumnsTemplate.reduce(
          (object, item) => ({ ...object, [item.key]: item.hidden }),
          {}
        )
      ),
      Math.max(1, milestoneCount),
      getColumnsConfigured(
        taskColumns('#', '#'),
        taskColumnsTemplate.reduce((object, item) => ({ ...object, [item.key]: item.hidden }), {})
      ),
      Math.max(1, taskCount)
    ),
  ];
}

type ProjectColumnsCache = {
  projectColumns: { [string]: boolean },
  milestoneColumns: { [string]: boolean },
  milestoneCount: number,
  taskColumns: { [string]: boolean },
  taskCount: number,
};

function getColumnsCache(key: string): Array<ColumnConfig> | null {
  const cache = getCache<ProjectColumnsCache>(SHEET_COLUMN_KEY_PREFIX, key);
  if (!cache || !typeof cache === 'object') {
    return null;
  }

  return [
    ...getColumnsConfigured(projectColumns, cache.projectColumns || {}),
    ...generateMilestoneTaskColumns(
      getColumnsConfigured(milestoneColumns('#'), cache.milestoneColumns || {}),
      Math.max(1, cache.milestoneCount || 1),
      getColumnsConfigured(taskColumns('#', '#'), cache.taskColumns || {}),
      Math.max(1, cache.taskCount || 1)
    ),
  ];
}

function setColumnsCache(key: string, columns: Array<ColumnConfig>) {
  const {
    milestoneColumnsTemplate,
    milestoneCount,
    taskColumnsTemplate,
    taskCount,
  } = computeMilestoneTaskColumnsTemplate(columns);

  setCache(SHEET_COLUMN_KEY_PREFIX, key, {
    projectColumns: columns.reduce((cache, col) => ({ ...cache, [col.key]: col.hidden }), {}),
    milestoneColumns: milestoneColumnsTemplate.reduce(
      (cache, col) => ({ ...cache, [col.key]: col.hidden }),
      {}
    ),
    milestoneCount,
    taskColumns: taskColumnsTemplate.reduce(
      (cache, col) => ({ ...cache, [col.key]: col.hidden }),
      {}
    ),
    taskCount,
  });
}

function useProjectColumns(cacheKey: string): [Array<ColumnConfig>, (Array<ColumnConfig>) => void] {
  const [currentColumns, setCurrentColumns] = React.useState<Array<ColumnConfig> | null>(null);

  React.useEffect(() => {
    if (!cacheKey || !currentColumns) {
      return;
    }

    setColumnsCache(cacheKey, currentColumns);
  }, [currentColumns, cacheKey]);

  function getColumns() {
    if (!currentColumns) {
      let value = [
        ...projectColumns,
        ...generateMilestoneTaskColumns(milestoneColumns('#'), 4, taskColumns('#', '#'), 5),
      ];

      if (cacheKey) {
        const cache = getColumnsCache(cacheKey);
        if (cache) {
          value = cache;
        }
      }

      setCurrentColumns(value);

      return value;
    }

    return currentColumns;
  }

  return [getColumns(), setCurrentColumns];
}

type Input = {
  sortBy: SortBy,
  setSortBy: SortBy => void,
  cacheKey: string,
};

type Output = {
  columns: Array<ColumnConfig>,
  columnStates: Array<ColumnState>,
  setColumns: (Array<ColumnConfig>) => void,
};

export function useProjectColumnStates({ sortBy, setSortBy, cacheKey }: Input): Output {
  const [currentColumns, setCurrentColumns] = useProjectColumns(cacheKey);
  const [currentResizedColumns, onColumnResize] = useResizedColumns(currentColumns, cacheKey);
  const [currentSortableResizedColumns, onColumnSort] = useSortedColumns({
    columns: currentResizedColumns,
    sortBy,
    setSortBy,
    cacheKey,
  });

  /**
   * Add a prefix to each milestone and task columns title.
   * For milestone columns: #{milestone index + 1} {title}
   * For tasks columns: #{milestone index + 1}-{task index + 1} {title}
   *
   * @type {Array<ColumnConfig>}
   */
  const columnsWithPrefix = React.useMemo<Array<ColumnConfig>>(
    () =>
      currentSortableResizedColumns.map(col => {
        if (col.key.startsWith('milestones')) {
          let matches = col.key.match(/milestones\.(\d+)/);
          if (matches) {
            const milestoneIdx = parseFloat(matches[1]);

            if (col.key.startsWith(`milestones.${milestoneIdx}.tasks`)) {
              matches = col.key.match(/milestones\.\d+\.tasks.(\d+)/);
              if (matches) {
                const taskIdx = parseFloat(matches[1]);

                return {
                  ...col,
                  title: (
                    <>
                      #{milestoneIdx + 1}-{taskIdx + 1} {col.title}
                    </>
                  ),
                };
              }
            }

            return {
              ...col,
              title: (
                <>
                  #{milestoneIdx + 1} {col.title}
                </>
              ),
            };
          }
        }

        return col;
      }),
    [currentSortableResizedColumns]
  );

  const columnStates = React.useMemo(
    () =>
      columnsWithPrefix.map(column => ({
        ...column,
        onResize: width => onColumnResize(column.key, width),
        sort: column.sort
          ? {
              ...column.sort,
              onToggle: () => onColumnSort(column.key),
            }
          : undefined,
      })),
    [columnsWithPrefix, onColumnResize, onColumnSort]
  );

  return {
    columns: currentSortableResizedColumns,
    columnStates,
    setColumns: setCurrentColumns,
  };
}
