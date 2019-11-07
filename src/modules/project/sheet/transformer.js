// @flow
import {
  transformComputedField,
  transformReadonlyField,
  transformValueField,
} from 'components/Sheet';
import type { CellValue } from 'components/Sheet/SheetState/types';
import {
  PROJECT_SET_DESCRIPTION,
  PROJECT_SET_DUE_DATE,
  PROJECT_SET_NAME,
  PROJECT_SET_TAGS,
  PROJECT_UPDATE,
} from 'modules/permission/constants/project';
import {
  MILESTONE_SET_DESCRIPTION,
  MILESTONE_SET_DOCUMENTS,
  MILESTONE_SET_NAME,
  MILESTONE_UPDATE,
} from 'modules/permission/constants/milestone';
import {
  TASK_SET_APPROVABLE,
  TASK_SET_DESCRIPTION,
  TASK_SET_NAME,
  TASK_SET_TAGS,
  TASK_UPDATE,
} from 'modules/permission/constants/task';

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
  basePath: string,
  milestone: Object,
  hasMilestones: boolean
): Array<CellValue> {
  return [
    {
      columnKey: 'project.milestone.created',
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
      columnKey: 'project.milestone.createdBy',
      type: 'text',
      ...transformReadonlyField(basePath, milestone, 'createdBy', milestone?.createdBy ?? null),
    },
    {
      columnKey: 'project.milestone.createdAt',
      type: 'text',
      ...transformReadonlyField(basePath, milestone, 'createdAt', milestone?.createdAt ?? null),
    },
    {
      columnKey: 'project.milestone.updated',
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
      columnKey: 'project.milestone.updatedBy',
      type: 'text',
      ...transformReadonlyField(basePath, milestone, 'updatedBy', milestone?.updatedBy ?? null),
    },
    {
      columnKey: 'project.milestone.updatedAt',
      type: 'text',
      ...transformReadonlyField(basePath, milestone, 'updatedAt', milestone?.updatedAt ?? null),
    },
    {
      columnKey: 'project.milestone.name',
      type: 'text',
      ...transformValueField(
        basePath,
        milestone,
        'name',
        hasPermission => hasPermission(MILESTONE_UPDATE) || hasPermission(MILESTONE_SET_NAME)
      ),
    },
    {
      columnKey: 'project.milestone.description',
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
    // completed
    {
      columnKey: 'project.milestone.files',
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
    disabled: !hasMilestones && !milestone,
    empty: hasMilestones && !milestone,
    parent: true,
  }));
}

function getCurrentTask(taskId, project) {
  return project.milestones
    .map(milestone => milestone.tasks)
    .flat()
    .find(task => task.id === taskId);
}

function transformTask(basePath: string, task: Object): Array<CellValue> {
  return [
    {
      columnKey: 'project.milestone.task.created',
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
      columnKey: 'project.milestone.task.createdBy',
      type: 'text',
      ...transformReadonlyField(basePath, task, 'createdBy', task?.createdBy ?? null),
    },
    {
      columnKey: 'project.milestone.task.createdAt',
      type: 'text',
      ...transformReadonlyField(basePath, task, 'createdAt', task?.createdAt ?? null),
    },
    {
      columnKey: 'project.milestone.task.updated',
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
      columnKey: 'project.milestone.task.updatedBy',
      type: 'text',
      ...transformReadonlyField(basePath, task, 'updatedBy', task?.updatedBy ?? null),
    },
    {
      columnKey: 'project.milestone.task.updatedAt',
      type: 'text',
      ...transformReadonlyField(basePath, task, 'updatedAt', task?.updatedAt ?? null),
    },
    {
      columnKey: 'project.milestone.task.name',
      type: 'text',
      ...transformValueField(
        basePath,
        task,
        'name',
        hasPermission => hasPermission(TASK_UPDATE) || hasPermission(TASK_SET_NAME)
      ),
    },
    {
      columnKey: 'project.milestone.task.description',
      type: 'textarea',
      ...transformValueField(
        basePath,
        task,
        'memo',
        hasPermission => hasPermission(TASK_UPDATE) || hasPermission(TASK_SET_DESCRIPTION)
      ),
    },
    // start date + binding
    // due date + binding
    // in progress
    // completed
    // rejected
    // skipped
    {
      columnKey: 'project.milestone.task.approvable',
      type: 'toggle',
      ...transformValueField(
        basePath,
        task,
        'approvable',
        hasPermission => hasPermission(TASK_UPDATE) || hasPermission(TASK_SET_APPROVABLE)
      ),
    },
    // approved
    // approvers
    {
      columnKey: 'project.milestone.task.tags',
      type: 'task_tags',
      ...transformValueField(
        basePath,
        task,
        'tags',
        hasPermission => hasPermission(TASK_UPDATE) || hasPermission(TASK_SET_TAGS)
      ),
    },
    {
      columnKey: 'project.milestone.task.logs',
      type: 'task_logs',
      ...transformValueField(basePath, task, 'id', () => true),
    },
  ].map(c => ({
    ...c,
    disabled: !task,
  }));
}

export default function transformer(index: number, project: Object): Array<Array<CellValue>> {
  const rows = [];

  let projectCells = transformProject(`${index}`, project);

  if (project.milestones.length > 0) {
    project.milestones.forEach((milestone, milestoneIdx) => {
      let milestoneCells = transformMilestone(
        `${index}.milestones.${milestoneIdx}`,
        milestone,
        true
      );

      if (milestone.tasks.length > 0) {
        milestone.tasks.forEach((task, taskIdx) => {
          rows.push([
            ...projectCells,
            ...milestoneCells,
            ...transformTask(`${index}.milestones.${milestoneIdx}.tasks.${taskIdx}`, task),
          ]);
          projectCells = transformProject(`${index}`, null);
          milestoneCells = transformMilestone(`${index}.milestones.${milestoneIdx}`, null, true);
        });
      } else {
        rows.push([
          ...projectCells,
          ...transformMilestone(`${index}.milestones.${milestoneIdx}`, milestone, true),
          ...transformTask(`${index}.milestones.${milestoneIdx}.tasks.-1`, null),
        ]);
        projectCells = transformProject(`${index}`, null);
      }
    });
  } else {
    rows.push([
      ...projectCells,
      ...transformMilestone(`${index}.milestones.-1`, null, false),
      ...transformTask(`${index}.milestones.-1.tasks.-1`, null),
    ]);
  }

  return rows;
}
