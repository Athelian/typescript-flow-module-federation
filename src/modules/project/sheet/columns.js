/* eslint-disable react/jsx-props-no-spreading */
// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { getCache, setCache } from 'utils/cache';
import { colors } from 'styles/common';
import type { ColumnConfig } from 'components/Sheet';
import { getColumnsConfigured, SHEET_COLUMN_KEY_PREFIX } from 'components/Sheet/useColumns';
import projectMessages from 'modules/project/messages';
import milestoneMessages from 'modules/milestone/messages';
import taskMessages from 'modules/task/messages';

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
    width: 110,
  },
  {
    key: `milestones.${milestoneIdx}.updated`,
    title: <FormattedMessage {...milestoneMessages.updatedAt} />,
    icon: 'MILESTONE_TASK',
    color: colors.MILESTONE,
    width: 110,
  },
  {
    key: `milestones.${milestoneIdx}.name`,
    title: <FormattedMessage {...milestoneMessages.name} />,
    icon: 'MILESTONE_TASK',
    color: colors.MILESTONE,
    width: 200,
  },
  {
    key: `milestones.${milestoneIdx}.description`,
    title: <FormattedMessage {...milestoneMessages.description} />,
    icon: 'MILESTONE_TASK',
    color: colors.MILESTONE,
    width: 200,
  },
  // dueDate + binding
  // estimatedCompletionDate + binding
  // completed
  {
    key: `milestones.${milestoneIdx}.files`,
    title: <FormattedMessage {...milestoneMessages.files} />,
    icon: 'MILESTONE_TASK',
    color: colors.MILESTONE,
    width: 200,
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
  // start date + binding
  // due date + binding
  // in progress
  // completed
  // rejected
  // skipped
  {
    key: `milestones.${milestoneIdx}.tasks.${taskIdx}.approvable`,
    title: <FormattedMessage {...taskMessages.approvable} />,
    icon: 'MILESTONE_TASK',
    color: colors.TASK,
    width: 200,
  },
  {
    key: `milestones.${milestoneIdx}.tasks.${taskIdx}.approved`,
    title: <FormattedMessage {...taskMessages.approved} />,
    icon: 'MILESTONE_TASK',
    color: colors.TASK,
    width: 110,
  },
  // approvers
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

export function useProjectColumns(
  cacheKey: string
): [Array<ColumnConfig>, (Array<ColumnConfig>) => void] {
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
