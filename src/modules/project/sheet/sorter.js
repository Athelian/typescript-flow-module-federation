// @flow
import type { ColumnSort } from 'components/Sheet/SheetState/types';
import { setDirection, defaultSort } from 'components/Sheet/SheetState/sorter';

function milestoneSorter(sorts: Array<ColumnSort>) {
  return (a: Object, b: Object): number => {
    let result = 0;

    sorts.every(sort => {
      switch (sort.name) {
        case 'createdAt':
          result = setDirection(defaultSort(a, b), sort.direction);
          break;
        default:
          break;
      }

      return result === 0;
    });

    return result;
  };
}

function taskSorter(sorts: Array<ColumnSort>) {
  return (a: Object, b: Object): number => {
    let result = 0;

    sorts.every(sort => {
      switch (sort.name) {
        case 'createdAt':
          result = setDirection(defaultSort(a, b), sort.direction);
          break;
        default:
          break;
      }
      return result === 0;
    });
    return result;
  };
}

export default function sorter(projects: Array<Object>, sorts: Array<ColumnSort>): Array<Object> {
  const milestoneSorts = sorts.filter(s => s.group === 'milestone');
  const taskSorts = sorts.filter(s => s.group === 'task');

  return projects.map(project => {
    switch (project.__typename) {
      case 'Forbidden':
      case 'NotFound':
        return project;
      default:
        return {
          ...project,
          milestones: project.milestones
            .map(milestone => {
              switch (milestone.__typename) {
                case 'Forbidden':
                case 'NotFound':
                  return milestone;
                default:
                  return {
                    ...milestone,
                    tasks: milestone.tasks.sort(taskSorter(taskSorts)),
                  };
              }
            })
            .sort(milestoneSorter(milestoneSorts)),
        };
    }
  });
}
