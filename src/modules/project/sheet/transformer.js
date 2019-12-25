// @flow
import { colors } from 'styles/common';
import {
  transformComputedField,
  transformReadonlyField,
  transformValueField,
} from 'components/Sheet';
import type { CellValue } from 'components/Sheet/SheetState/types';
import { parseGroupIds } from 'utils/task';
import {
  PROJECT_SET_DESCRIPTION,
  PROJECT_SET_DUE_DATE,
  PROJECT_SET_NAME,
  PROJECT_SET_TAGS,
  PROJECT_UPDATE,
} from 'modules/permission/constants/project';
import {
  MILESTONE_SET_COMPLETED,
  MILESTONE_SET_DESCRIPTION,
  MILESTONE_SET_DOCUMENTS,
  MILESTONE_SET_NAME,
  MILESTONE_UPDATE,
} from 'modules/permission/constants/milestone';
import {
  TASK_SET_APPROVABLE,
  TASK_SET_APPROVED,
  TASK_SET_DESCRIPTION,
  TASK_SET_NAME,
  TASK_SET_TAGS,
  TASK_SET_START_DATE,
  TASK_SET_DUE_DATE,
  TASK_UPDATE,
  TASK_SET_IN_PROGRESS,
  TASK_SET_COMPLETED,
  TASK_SET_SKIPPED,
  TASK_SET_REJECTED,
  TASK_SET_ASSIGNEES,
  TASK_SET_APPROVERS,
} from 'modules/permission/constants/task';

function getCurrentMilestone(milestoneId, project) {
  return project.milestones.find(m => m.id === milestoneId);
}

function getCurrentTask(taskId, project) {
  return project.milestones.flatMap(milestone => milestone.tasks).find(task => task.id === taskId);
}

function transformProject(basePath: string, project: Object): Array<CellValue> {
  return [
    {
      columnKey: 'project.created',
      type: 'date_user',
      ...transformComputedField(basePath, project, 'created', item => ({
        at: new Date(item.createdAt),
        by: item.createdBy,
      })),
    },
    {
      columnKey: 'project.createdBy',
      type: 'text',
      ...transformReadonlyField(basePath, project, 'createdBy', project?.createdBy ?? null),
    },
    {
      columnKey: 'project.createdAt',
      type: 'text',
      ...transformReadonlyField(basePath, project, 'createdAt', project?.createdAt ?? null),
    },
    {
      columnKey: 'project.updated',
      type: 'date_user',
      ...transformComputedField(basePath, project, 'updated', item => ({
        at: new Date(item.updatedAt),
        by: item.updatedBy,
      })),
    },
    {
      columnKey: 'project.updatedBy',
      type: 'text',
      ...transformReadonlyField(basePath, project, 'updatedBy', project?.updatedBy ?? null),
    },
    {
      columnKey: 'project.updatedAt',
      type: 'text',
      ...transformReadonlyField(basePath, project, 'updatedAt', project?.updatedAt ?? null),
    },
    {
      columnKey: 'project.name',
      type: 'text',
      ...transformValueField(
        basePath,
        project,
        'name',
        hasPermission => hasPermission(PROJECT_UPDATE) || hasPermission(PROJECT_SET_NAME)
      ),
    },
    {
      columnKey: 'project.description',
      type: 'textarea',
      ...transformValueField(
        basePath,
        project,
        'description',
        hasPermission => hasPermission(PROJECT_UPDATE) || hasPermission(PROJECT_SET_DESCRIPTION)
      ),
    },
    {
      columnKey: 'project.dueDate',
      type: 'date',
      ...transformValueField(
        basePath,
        project,
        'dueDate',
        hasPermission => hasPermission(PROJECT_UPDATE) || hasPermission(PROJECT_SET_DUE_DATE)
      ),
    },
    {
      columnKey: 'project.tags',
      type: 'project_tags',
      ...transformValueField(
        basePath,
        project,
        'tags',
        hasPermission => hasPermission(PROJECT_UPDATE) || hasPermission(PROJECT_SET_TAGS)
      ),
    },
    {
      columnKey: 'project.logs',
      type: 'project_logs',
      ...transformValueField(basePath, project, 'id', () => true),
    },
  ].map(c => ({
    ...c,
    empty: !project,
    parent: true,
  }));
}

function transformMilestone(
  milestoneIdx: number,
  basePath: string,
  milestone: Object
): Array<CellValue> {
  return [
    {
      columnKey: `milestones.${milestoneIdx}.created`,
      type: 'date_user',
      ...transformComputedField(basePath, milestone, 'created', item => {
        const currentMilestone = item.milestones.find(m => m.id === milestone?.id);
        return currentMilestone
          ? {
              at: new Date(currentMilestone.createdAt),
              by: currentMilestone.createdBy,
            }
          : null;
      }),
    },
    {
      columnKey: `milestones.${milestoneIdx}.createdBy`,
      type: 'text',
      ...transformReadonlyField(basePath, milestone, 'createdBy', milestone?.createdBy ?? null),
    },
    {
      columnKey: `milestones.${milestoneIdx}.createdAt`,
      type: 'text',
      ...transformReadonlyField(basePath, milestone, 'createdAt', milestone?.createdAt ?? null),
    },
    {
      columnKey: `milestones.${milestoneIdx}.updated`,
      type: 'date_user',
      ...transformComputedField(basePath, milestone, 'updated', item => {
        const currentMilestone = item.milestones.find(oi => oi.id === milestone?.id);
        return currentMilestone
          ? {
              at: new Date(currentMilestone.updatedAt),
              by: currentMilestone.updatedBy,
            }
          : null;
      }),
    },
    {
      columnKey: `milestones.${milestoneIdx}.updatedBy`,
      type: 'text',
      ...transformReadonlyField(basePath, milestone, 'updatedBy', milestone?.updatedBy ?? null),
    },
    {
      columnKey: `milestones.${milestoneIdx}.updatedAt`,
      type: 'text',
      ...transformReadonlyField(basePath, milestone, 'updatedAt', milestone?.updatedAt ?? null),
    },
    {
      columnKey: `milestones.${milestoneIdx}.name`,
      type: 'text',
      ...transformValueField(
        basePath,
        milestone,
        'name',
        hasPermission => hasPermission(MILESTONE_UPDATE) || hasPermission(MILESTONE_SET_NAME)
      ),
    },
    {
      columnKey: `milestones.${milestoneIdx}.description`,
      type: 'textarea',
      ...transformValueField(
        basePath,
        milestone,
        'description',
        hasPermission => hasPermission(MILESTONE_UPDATE) || hasPermission(MILESTONE_SET_DESCRIPTION)
      ),
    },
    // dueDate + binding
    // estimatedCompletionDate + binding
    {
      columnKey: `milestones.${milestoneIdx}.status`,
      type: 'status_select',
      extra: [
        {
          value: 'completed',
          label: 'Completed',
          color: colors.TEAL_HALF,
          textColor: colors.WHITE,
        },
        {
          value: 'uncompleted',
          label: 'Uncompleted',
          color: colors.GRAY_SUPER_LIGHT,
          textColor: colors.GRAY_DARK,
        },
      ],
      ...transformValueField(
        basePath,
        milestone,
        'status',
        hasPermission => hasPermission(MILESTONE_UPDATE) || hasPermission(MILESTONE_SET_COMPLETED)
      ),
    },
    {
      columnKey: `milestones.${milestoneIdx}.statusDate`,
      type: 'status_date',
      hide: project => {
        const currentMilestone = getCurrentMilestone(milestone.id, project);
        return currentMilestone.status === 'uncompleted';
      },
      computed: project => {
        const currentMilestone = getCurrentMilestone(milestone.id, project);
        return currentMilestone.status;
      },
      ...transformValueField(
        basePath,
        milestone,
        'statusDate',
        hasPermission => hasPermission(MILESTONE_UPDATE) || hasPermission(MILESTONE_SET_COMPLETED)
      ),
    },
    {
      columnKey: `milestones.${milestoneIdx}.files`,
      type: 'milestone_documents',
      ...transformValueField(
        basePath,
        milestone,
        'files',
        hasPermission => hasPermission(MILESTONE_UPDATE) || hasPermission(MILESTONE_SET_DOCUMENTS)
      ),
    },
  ].map(c => ({
    ...c,
    empty: !milestone,
  }));
}

function transformTask(
  milestoneIdx: number,
  taskIdx: number,
  basePath: string,
  task: Object
): Array<CellValue> {
  return [
    {
      columnKey: `milestones.${milestoneIdx}.tasks.${taskIdx}.created`,
      type: 'date_user',
      ...transformComputedField(basePath, task, 'created', project => {
        const currentTask = getCurrentTask(task?.id, project);
        return currentTask
          ? {
              at: new Date(currentTask.createdAt),
              by: currentTask.createdBy,
            }
          : null;
      }),
    },
    {
      columnKey: `milestones.${milestoneIdx}.tasks.${taskIdx}.createdBy`,
      type: 'text',
      ...transformReadonlyField(basePath, task, 'createdBy', task?.createdBy ?? null),
    },
    {
      columnKey: `milestones.${milestoneIdx}.tasks.${taskIdx}.createdAt`,
      type: 'text',
      ...transformReadonlyField(basePath, task, 'createdAt', task?.createdAt ?? null),
    },
    {
      columnKey: `milestones.${milestoneIdx}.tasks.${taskIdx}.updated`,
      type: 'date_user',
      ...transformComputedField(basePath, task, 'updated', project => {
        const currentTask = getCurrentTask(task?.id, project);
        return currentTask
          ? {
              at: new Date(currentTask.updatedAt),
              by: currentTask.updatedBy,
            }
          : null;
      }),
    },
    {
      columnKey: `milestones.${milestoneIdx}.tasks.${taskIdx}.updatedBy`,
      type: 'text',
      ...transformReadonlyField(basePath, task, 'updatedBy', task?.updatedBy ?? null),
    },
    {
      columnKey: `milestones.${milestoneIdx}.tasks.${taskIdx}.updatedAt`,
      type: 'text',
      ...transformReadonlyField(basePath, task, 'updatedAt', task?.updatedAt ?? null),
    },
    {
      columnKey: `milestones.${milestoneIdx}.tasks.${taskIdx}.name`,
      type: 'text',
      ...transformValueField(
        basePath,
        task,
        'name',
        hasPermission => hasPermission(TASK_UPDATE) || hasPermission(TASK_SET_NAME)
      ),
    },
    {
      columnKey: `milestones.${milestoneIdx}.tasks.${taskIdx}.description`,
      type: 'textarea',
      ...transformValueField(
        basePath,
        task,
        'memo',
        hasPermission => hasPermission(TASK_UPDATE) || hasPermission(TASK_SET_DESCRIPTION)
      ),
    },
    {
      columnKey: `milestones.${milestoneIdx}.tasks.${taskIdx}.startDate`,
      type: 'date_binding',
      computed: project => {
        const currentTask = getCurrentTask(task?.id, project);
        return {
          parentEntity: currentTask?.entity?.__typename,
          type: 'startDate',
        };
      },
      ...transformValueField(
        basePath,
        task,
        'startDateBindingData',
        hasPermission => hasPermission(TASK_UPDATE) || hasPermission(TASK_SET_START_DATE)
      ),
    },
    {
      columnKey: `milestones.${milestoneIdx}.tasks.${taskIdx}.dueDate`,
      type: 'date_binding',
      computed: project => {
        const currentTask = getCurrentTask(task?.id, project);
        return {
          parentEntity: currentTask?.entity?.__typename,
          type: 'dueDate',
        };
      },
      ...transformValueField(
        basePath,
        task,
        'dueDateBindingData',
        hasPermission => hasPermission(TASK_UPDATE) || hasPermission(TASK_SET_DUE_DATE)
      ),
    },
    {
      columnKey: `milestones.${milestoneIdx}.tasks.${taskIdx}.status`,
      type: 'status_select',
      extra: [
        {
          value: 'in_progress',
          label: 'In Progress',
          color: colors.WHITE,
          textColor: colors.TEAL,
        },
        {
          value: 'completed',
          label: 'Completed',
          color: colors.TEAL_HALF,
          textColor: colors.WHITE,
        },
        {
          value: 'skipped',
          label: 'Skipped',
          color: colors.GRAY_LIGHT_HALF,
          textColor: colors.BLACK,
        },
        {
          value: 'uncompleted',
          label: 'Uncompleted',
          color: colors.GRAY_SUPER_LIGHT,
          textColor: colors.GRAY_DARK,
        },
      ],
      ...transformValueField(
        basePath,
        task,
        'status',
        hasPermission =>
          hasPermission(TASK_UPDATE) ||
          (hasPermission(TASK_SET_IN_PROGRESS) &&
            hasPermission(TASK_SET_COMPLETED) &&
            hasPermission(TASK_SET_SKIPPED))
      ),
    },
    {
      columnKey: `milestones.${milestoneIdx}.tasks.${taskIdx}.statusDate`,
      type: 'status_date',
      hide: project => {
        const currentTask = getCurrentTask(task.id, project);
        return currentTask.status === 'uncompleted';
      },
      computed: project => {
        const currentTask = getCurrentTask(task.id, project);
        return currentTask.status;
      },
      ...transformValueField(
        basePath,
        task,
        'statusDate',
        hasPermission =>
          hasPermission(TASK_UPDATE) ||
          (hasPermission(TASK_SET_IN_PROGRESS) &&
            hasPermission(TASK_SET_COMPLETED) &&
            hasPermission(TASK_SET_SKIPPED))
      ),
    },
    {
      columnKey: `milestones.${milestoneIdx}.tasks.${taskIdx}.assignedTo`,
      type: 'user_assignment',
      computed: root => {
        const currentTask = getCurrentTask(task.id, root);
        return parseGroupIds(currentTask);
      },
      ...transformValueField(
        basePath,
        task,
        'assignedTo',
        hasPermission => hasPermission(TASK_UPDATE) || hasPermission(TASK_SET_ASSIGNEES)
      ),
    },
    {
      columnKey: `milestones.${milestoneIdx}.tasks.${taskIdx}.approvable`,
      type: 'toggle',
      ...transformValueField(
        basePath,
        task,
        'approvable',
        hasPermission => hasPermission(TASK_UPDATE) || hasPermission(TASK_SET_APPROVABLE)
      ),
    },
    {
      columnKey: `milestones.${milestoneIdx}.tasks.${taskIdx}.approvalStatus`,
      type: 'status_select',
      extra: [
        {
          value: 'approved',
          label: 'Approved',
          color: colors.BLUE_HALF,
          textColor: colors.WHITE,
        },
        {
          value: 'rejected',
          label: 'Rejected',
          color: colors.RED_HALF,
          textColor: colors.WHITE,
        },
        {
          value: 'unapproved',
          label: 'Unapproved',
          color: colors.GRAY_SUPER_LIGHT,
          textColor: colors.GRAY_DARK,
        },
      ],
      hide: project => {
        const currentTask = getCurrentTask(task?.id, project);
        return !(currentTask?.approvable ?? false);
      },
      ...transformValueField(
        basePath,
        task,
        'approvalStatus',
        hasPermission =>
          hasPermission(TASK_UPDATE) ||
          (hasPermission(TASK_SET_APPROVED) && hasPermission(TASK_SET_REJECTED))
      ),
    },
    {
      columnKey: `milestones.${milestoneIdx}.tasks.${taskIdx}.approvalStatusDate`,
      type: 'status_date',
      hide: project => {
        const currentTask = getCurrentTask(task.id, project);
        return !(currentTask?.approvable ?? false) || currentTask.approvalStatus === 'unapproved';
      },
      computed: project => {
        const currentTask = getCurrentTask(task.id, project);
        return currentTask.approvalStatus;
      },
      ...transformValueField(
        basePath,
        task,
        'approvalStatusDate',
        hasPermission =>
          hasPermission(TASK_UPDATE) ||
          (hasPermission(TASK_SET_APPROVED) && hasPermission(TASK_SET_REJECTED))
      ),
    },
    {
      columnKey: `milestones.${milestoneIdx}.tasks.${taskIdx}.approvers`,
      type: 'user_assignment',
      computed: root => {
        const currentTask = getCurrentTask(task.id, root);
        return parseGroupIds(currentTask);
      },
      ...transformValueField(
        basePath,
        task,
        'approvers',
        hasPermission => hasPermission(TASK_UPDATE) || hasPermission(TASK_SET_APPROVERS)
      ),
    },
    {
      columnKey: `milestones.${milestoneIdx}.tasks.${taskIdx}.tags`,
      type: 'task_tags',
      ...transformValueField(
        basePath,
        task,
        'tags',
        hasPermission => hasPermission(TASK_UPDATE) || hasPermission(TASK_SET_TAGS)
      ),
    },
    {
      columnKey: `milestones.${milestoneIdx}.tasks.${taskIdx}.logs`,
      type: 'task_logs',
      ...transformValueField(basePath, task, 'id', () => true),
    },
  ].map(c => ({
    ...c,
    disabled: !task,
  }));
}

export default function transformer(index: number, project: Object): Array<Array<CellValue>> {
  const row = [...transformProject(`${index}`, project)];

  (project?.milestones ?? []).forEach((milestone, milestoneIdx) => {
    row.push(...transformMilestone(milestoneIdx, `${index}.milestones.${milestoneIdx}`, milestone));

    (milestone?.tasks ?? []).forEach((task, taskIdx) => {
      row.push(
        ...transformTask(
          milestoneIdx,
          taskIdx,
          `${index}.milestones.${milestoneIdx}.tasks.${taskIdx}`,
          task
        )
      );
    });
  });

  return [row];
}
