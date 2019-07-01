// @flow
import { flatten } from 'lodash';
import { Container } from 'unstated';
import update from 'immutability-helper';
import pluralize from 'pluralize';
import { camelCase } from 'lodash/fp';
import type { User, Milestone, Task } from 'generated/graphql';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import { uuid } from 'utils/id';
import { calculateTasks, setToSkipTask, setToComplete } from './helpers';

type FormState = {
  milestones: Array<Milestone>,
  ignoreTaskIds: [],
};

export const initValues: FormState = {
  milestones: [],
  ignoreTaskIds: [],
};

export default class ProjectMilestonesContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  initDetailValues = (milestones: Array<Milestone>, ignoreTaskIds: Array<string> = []) => {
    this.setState({ milestones, ignoreTaskIds });
    this.originalValues = { milestones, ignoreTaskIds };
  };

  taskCountByMilestone = (
    id: string
  ): {
    count: number,
    remain: number,
    inProgress: number,
    completed: number,
    rejected: number,
    approved: number,
    skipped: number,
    delayed: number,
    unapproved: number,
  } => {
    const tasks: Array<Task> = getByPathWithDefault(
      [],
      'tasks',
      this.state.milestones.find(milestone => milestone.id === id)
    );
    return calculateTasks(tasks);
  };

  taskCount = (): {
    count: number,
    remain: number,
    inProgress: number,
    completed: number,
    rejected: number,
    approved: number,
    skipped: number,
    delayed: number,
    unapproved: number,
  } => {
    const tasks: Array<Task> = flatten(
      this.state.milestones.map(item => getByPathWithDefault([], 'tasks', item))
    );
    return calculateTasks(tasks);
  };

  completedMilestone = async ({
    id,
    completedBy,
    completedAt,
    action,
  }: {
    id: string,
    completedBy: ?User,
    completedAt: ?Date,
    action: 'setToSkip' | 'setToComplete' | 'leaveUnChange',
  }) => {
    const tasks: Array<Task> = getByPathWithDefault(
      [],
      'tasks',
      this.state.milestones.find(milestone => milestone.id === id)
    );
    const index = this.state.milestones.findIndex(milestone => milestone.id === id);
    switch (action) {
      case 'setToSkip': {
        await this.setState(prevState =>
          update(prevState, {
            milestones: {
              [index]: {
                tasks: {
                  $set: tasks.map(task => setToSkipTask(task, { completedAt, completedBy })),
                },
              },
            },
          })
        );
        this.setMilestoneValue(id, {
          completedAt,
          completedBy,
        });
        break;
      }
      case 'setToComplete': {
        await this.setState(prevState =>
          update(prevState, {
            milestones: {
              [index]: {
                tasks: {
                  $set: tasks.map(task => setToComplete(task, { completedAt, completedBy })),
                },
              },
            },
          })
        );
        this.setMilestoneValue(id, {
          completedAt,
          completedBy,
        });
        break;
      }

      default:
        this.setMilestoneValue(id, {
          completedAt,
          completedBy,
        });
        break;
    }
  };

  setMilestoneValue = (id: string, value: Object) => {
    const index = this.state.milestones.findIndex(milestone => milestone.id === id);
    this.setState(prevState =>
      update(prevState, {
        milestones: {
          [index]: {
            $merge: value,
          },
        },
      })
    );
  };

  removeMilestone = (id: string, removeOnTasks: boolean = false) => {
    const index = this.state.milestones.findIndex(milestone => milestone.id === id);
    const taskIds = this.state.milestones[index].tasks
      .map(task => getByPathWithDefault('', 'id', task))
      .filter(Boolean);
    if (removeOnTasks) {
      this.setState(prevState =>
        update(prevState, {
          milestones: {
            $splice: [[index, 1]],
          },
          ignoreTaskIds: {
            $push: taskIds,
          },
        })
      );
    } else {
      this.setState(prevState =>
        update(prevState, {
          milestones: {
            $splice: [[index, 1]],
          },
        })
      );
    }
  };

  newMilestone = () => {
    this.setState(prevState => ({
      ...prevState,
      milestones: [
        ...prevState.milestones,
        {
          id: uuid(),
          name: `Milestone - ${prevState.milestones.length + 1}`,
          dueDate: null,
          tasks: [],
        },
      ],
    }));
  };

  milestoneStatus = () => {
    return (this.state.milestones.map(milestone => ({
      name: milestone.name,
      dueDate: milestone.dueDate,
      isCompleted: !!milestone.completedBy,
      total: (milestone.tasks || []).length,
      completed: (milestone.tasks || []).filter(
        task => !!getByPathWithDefault('', 'completedBy', task)
      ).length,
    })): Array<{
      name: string,
      dueDate: ?Date,
      isCompleted: boolean,
      total: number,
      completed: number,
    }>);
  };

  changeMilestoneOrdering = (ordering: Array<string>) => {
    this.setState(prevState => ({
      milestones: ordering.map(id => prevState.milestones.find(item => item.id === id)),
    }));
  };

  changeMilestones = (columns: Object) => {
    const ordering = Object.keys(columns);
    this.setState(prevState => ({
      milestones: ordering.map(id => ({
        ...prevState.milestones.find(item => item.id === id),
        tasks: columns[id].map((task, milestoneSort) => ({ ...task, milestoneSort })),
      })),
    }));
  };

  excludeTaskIds = () => {
    const taskIds = flatten(this.state.milestones.map(item => item.tasks))
      .map(task => getByPathWithDefault('', 'id', task))
      .filter(Boolean);
    const originalTasks = flatten(this.originalValues.milestones.map(item => item.tasks));
    return (originalTasks
      .filter(task => !taskIds.includes(getByPathWithDefault('', 'id', task)))
      .map(task => getByPathWithDefault('', 'id', task)): Array<string>);
  };

  excludeIds = () => {
    const taskIds = flatten(this.state.milestones.map(item => item.tasks))
      .map(task => getByPathWithDefault('', 'id', task))
      .filter(Boolean);
    return [...taskIds, ...this.state.ignoreTaskIds];
  };

  countBindingEntities = () => {
    return this.state.milestones.reduce(
      (total, item) => {
        return {
          products: total.products + getByPathWithDefault(0, 'entitiesCount.products', item),
          productProviders:
            total.productProviders +
            getByPathWithDefault(0, 'entitiesCount.productProviders', item),
          orders: total.orders + getByPathWithDefault(0, 'entitiesCount.orders', item),
          orderItems: total.orderItems + getByPathWithDefault(0, 'entitiesCount.orderItems', item),
          batches: total.batches + getByPathWithDefault(0, 'entitiesCount.batches', item),
          shipments: total.shipments + getByPathWithDefault(0, 'entitiesCount.shipments', item),
          containers: total.containers + getByPathWithDefault(0, 'entitiesCount.containers', item),
        };
      },
      {
        products: 0,
        productProviders: 0,
        orders: 0,
        orderItems: 0,
        batches: 0,
        shipments: 0,
        containers: 0,
      }
    );
  };

  lastMilestoneDueDate = () => {
    return getByPathWithDefault(
      '',
      `${this.state.milestones.length - 1}.dueDate`,
      this.state.milestones
    );
  };

  countRelatedEntities = (projectId: string) => {
    const processEntities = [];
    const tasks = flatten(this.state.milestones.map(item => item.tasks));
    return tasks.reduce(
      (result, task) => {
        const entity = getByPathWithDefault('', 'entity.__typename', task);
        const id = getByPathWithDefault('', 'entity.id', task);
        const bindProjectId = getByPathWithDefault('', 'todo.milestone.project.id', task);
        const selectedField = pluralize(camelCase(entity));
        if (!processEntities.includes(`${id}-${entity}`) && bindProjectId !== projectId) {
          processEntities.push(`${id}-${entity}`);
          return {
            ...result,
            [selectedField]: result[selectedField] + 1,
          };
        }

        return result;
      },
      {
        products: 0,
        productProviders: 0,
        orders: 0,
        orderItems: 0,
        batches: 0,
        shipments: 0,
        containers: 0,
      }
    );
  };
}
