// @flow
import { flatten } from 'lodash';
import update from 'immutability-helper';
import { Container } from 'unstated';
import pluralize from 'pluralize';
import { camelCase } from 'lodash/fp';
import type { Milestone } from 'generated/graphql';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import { uuid } from 'utils/id';

type FormState = {
  milestones: Array<Milestone>,
};

export const initValues: FormState = {
  milestones: [],
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

  initDetailValues = (milestones: Array<Milestone>) => {
    this.setState({ milestones });
    this.originalValues = { milestones };
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
        tasks: columns[id],
      })),
    }));
  };

  excludeTaskIds = () => {
    const tasks = flatten(this.state.milestones.map(item => item.tasks));
    return (tasks.map(task => getByPathWithDefault('', 'id', task)): Array<string>);
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
