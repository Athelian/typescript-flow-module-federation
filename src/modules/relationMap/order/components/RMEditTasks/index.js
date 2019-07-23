// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Mutation } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';
import { Subscribe } from 'unstated';
import { getByPathWithDefault } from 'utils/fp';
import ActionDispatch from 'modules/relationMap/order/provider';
import { selectors } from 'modules/relationMap/order/store';
import { Content, SlideViewLayout } from 'components/Layout';
import { SlideViewNavBar } from 'components/NavBar';
import useFilter from 'hooks/useFilter';
import { FilterToolBar } from 'components/common';
import { ResetButton, SaveButton } from 'components/Buttons';
import { FormContainer } from 'modules/form';
import loadMore from 'utils/loadMore';
import messages from 'modules/task/messages';
import TaskListInSlide from './components/TaskListInSlide';
import RMEditTasksContainer from './container';
import editableTaskListQuery from './query';
import { taskUpdateManyMutation, prepareTasksForUpdateMany } from './mutation';

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

const onSave = async (
  originalValues: { tasks: Array<Object> },
  values: { tasks: Array<Object> },
  saveTasks: Function,
  onSuccess: Function = () => {},
  onErrors: Function = () => {}
) => {
  const tasks = prepareTasksForUpdateMany(originalValues.tasks, values.tasks);

  const result = await saveTasks({ variables: { tasks } });
  if (
    result &&
    result.data &&
    result.data.taskUpdateMany &&
    result.data.taskUpdateMany.violations
  ) {
    onErrors(result.data.taskUpdateMany.violations);
  } else {
    onSuccess();
  }
};

const RMEditTasks = (props: Props) => {
  const { intl } = props;
  const { state } = React.useContext(ActionDispatch);
  const uiSelectors = selectors(state);
  const orderIds = uiSelectors.targetedOrderIds();
  const orderItemIds = uiSelectors.targetedOrderItemIds();
  const batchIds = uiSelectors.targetedBatchIds();
  const shipmentIds = uiSelectors.targetedShipmentIds();
  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.name), value: 'name' },
    { title: intl.formatMessage(messages.startDate), value: 'startDate' },
    { title: intl.formatMessage(messages.dueDate), value: 'dueDate' },
    { title: intl.formatMessage(messages.entity), value: 'entity' },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    getInitFilter(),
    'filterRMTasks'
  );
  const entities = [
    ...orderIds.map(orderId => ({ orderId })),
    ...orderItemIds.map(orderItemId => ({ orderItemId })),
    ...batchIds.map(batchId => ({ batchId })),
    ...shipmentIds.map(shipmentId => ({ shipmentId })),
  ];
  const variables = {
    ...queryVariables,
    filterBy: {
      ...queryVariables.filterBy,
      entities,
    },
  };
  const { data, loading: queryLoading, fetchMore } = useQuery(editableTaskListQuery, {
    variables,
    fetchPolicy: 'network-only',
  });
  const nextPage = getByPathWithDefault(1, 'tasks.page', data) + 1;
  const totalPage = getByPathWithDefault(1, 'tasks.totalPage', data);
  const hasMore = nextPage <= totalPage;
  const tasks = getByPathWithDefault([], 'tasks.nodes', data);

  return (
    <Mutation mutation={taskUpdateManyMutation}>
      {(saveTasks, { loading: isLoading, error: mutationError }) => (
        <Subscribe to={[RMEditTasksContainer, FormContainer]}>
          {(rmEditTasksContainer, formContainer) => (
            <SlideViewLayout>
              <SlideViewNavBar>
                <FilterToolBar
                  icon="TASK"
                  sortFields={sortFields}
                  filtersAndSort={filterAndSort}
                  onChange={onChangeFilter}
                  canSort
                  canSearch
                />
                {rmEditTasksContainer.isDirty() && (
                  <>
                    <ResetButton
                      onClick={() => {
                        rmEditTasksContainer.initDetailValues([]);
                        formContainer.onReset();
                      }}
                    />
                    <SaveButton
                      isLoading={isLoading}
                      onClick={() =>
                        onSave(
                          rmEditTasksContainer.originalValues,
                          rmEditTasksContainer.state,
                          saveTasks,
                          () => {
                            rmEditTasksContainer.onSuccess();
                            formContainer.onReset();
                          },
                          formContainer.onErrors
                        )
                      }
                    />
                  </>
                )}
              </SlideViewNavBar>

              <Content>
                {mutationError && <p>Error: Please try again.</p>}
                <TaskListInSlide
                  tasks={rmEditTasksContainer.selectTasks(tasks)}
                  onLoadMore={() => loadMore({ fetchMore, data }, filterAndSort, 'tasks')}
                  hasMore={hasMore}
                  isLoading={queryLoading}
                  onChange={(id, updateTask) =>
                    rmEditTasksContainer.updateTaskById({
                      id,
                      updateTask,
                      tasks,
                    })
                  }
                />
              </Content>
            </SlideViewLayout>
          )}
        </Subscribe>
      )}
    </Mutation>
  );
};

export default injectIntl(RMEditTasks);
