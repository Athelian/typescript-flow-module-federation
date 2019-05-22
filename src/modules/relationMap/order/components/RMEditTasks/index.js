// @flow
import React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Query, Mutation } from 'react-apollo';
import { Subscribe } from 'unstated';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import ActionDispatch from 'modules/relationMap/order/provider';
import { selectors } from 'modules/relationMap/order/store';
import Layout from 'components/Layout';
import { SlideViewNavBar } from 'components/NavBar';
import useFilter from 'hooks/useFilter';
import { FilterToolBar } from 'components/common';
import { ResetButton, SaveButton } from 'components/Buttons';
import { FormContainer, resetFormState } from 'modules/form';
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

const EditableTaskList = (props: Props) => {
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

  return (
    <Subscribe to={[RMEditTasksContainer, FormContainer]}>
      {(rmEditTasksContainer, formContainer) => (
        <Mutation mutation={taskUpdateManyMutation}>
          {(saveTasks, { loading: isLoading, error: mutationError }) => (
            <Layout
              navBar={
                <SlideViewNavBar>
                  <FilterToolBar
                    icon="TASK"
                    sortFields={sortFields}
                    filtersAndSort={filterAndSort}
                    onChange={onChangeFilter}
                  />
                  {rmEditTasksContainer.isDirty() && (
                    <>
                      <ResetButton
                        onClick={() => {
                          resetFormState(rmEditTasksContainer, 'tasks');
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
              }
            >
              {mutationError && <p>Error: Please try again.</p>}
              <Query
                query={editableTaskListQuery}
                variables={variables}
                fetchPolicy="no-cache"
                onCompleted={data => {
                  const tasks = getByPathWithDefault([], 'tasks.nodes', data);
                  if (
                    !isEquals(tasks, rmEditTasksContainer.state.tasks) ||
                    (rmEditTasksContainer.state.tasks.length === 0 && tasks.length > 0)
                  ) {
                    rmEditTasksContainer.initDetailValues(tasks);
                  }
                }}
              >
                {({ error: queryError, loading: queryLoading, data, fetchMore }) => {
                  if (queryError) {
                    return queryError.message;
                  }

                  const nextPage = getByPathWithDefault(1, 'tasks.page', data) + 1;
                  const totalPage = getByPathWithDefault(1, 'tasks.totalPage', data);
                  const hasMore = nextPage <= totalPage;

                  return (
                    <TaskListInSlide
                      tasks={rmEditTasksContainer.state.tasks}
                      onLoadMore={() => loadMore({ fetchMore, data }, filterAndSort, 'tasks')}
                      hasMore={hasMore}
                      isLoading={queryLoading}
                      onChange={rmEditTasksContainer.setDeepFieldValue}
                    />
                  );
                }}
              </Query>
            </Layout>
          )}
        </Mutation>
      )}
    </Subscribe>
  );
};

export default injectIntl(EditableTaskList);
