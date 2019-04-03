// @flow
import React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Query } from 'react-apollo';
import { Provider, Subscribe } from 'unstated';
import { getByPathWithDefault } from 'utils/fp';
import ActionDispatch from 'modules/relationMap/order/provider';
import { selectors } from 'modules/relationMap/order/store';
import Layout from 'components/Layout';
import { SlideViewNavBar } from 'components/NavBar';
import useFilter from 'hooks/useFilter';
import { FilterToolBar } from 'components/common';
import { ResetButton, SaveButton } from 'components/Buttons';
import { FormContainer, resetFormState } from 'modules/form';
import LoadingIcon from 'components/LoadingIcon';
import messages from 'modules/task/messages';
import TaskListInSlide from './components/TaskListInSlide';
import RMTaskListContainer from './container';
import { editableTaskListQuery } from './query';

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
    // TODO: load all or load on page?
    perPage: 1000,
    page: 1,
  };
  return state;
};

const EditableTaskList = (props: Props) => {
  const { intl } = props;
  const { state } = React.useContext(ActionDispatch);

  const uiSelectors = selectors(state);
  const orderIds = uiSelectors.targetedOrderIds();
  const batchIds = uiSelectors.targetedBatchIds();
  const shipmentIds = uiSelectors.targetedShipmentIds();

  const sortFields = [
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.startDate), value: 'startDate' },
    { title: intl.formatMessage(messages.dueDate), value: 'dueDate' },
  ];

  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    getInitFilter(),
    'filterRMTasks'
  );

  const entities = [
    ...orderIds.map(orderId => ({ orderId })),
    ...batchIds.map(batchId => ({ batchId })),
    ...shipmentIds.map(shipmentId => ({ shipmentId })),
  ];

  return (
    <Provider>
      <Subscribe to={[RMTaskListContainer, FormContainer]}>
        {(taskListContainer, formContainer) => (
          <Layout
            navBar={
              <SlideViewNavBar>
                <FilterToolBar
                  icon="TASK"
                  sortFields={sortFields}
                  filtersAndSort={filterAndSort}
                  onChange={onChangeFilter}
                />

                {taskListContainer.isDirty() && (
                  <>
                    <ResetButton
                      onClick={() => {
                        resetFormState(taskListContainer, 'tasks');
                        formContainer.onReset();
                      }}
                    />
                    <SaveButton onClick={() => console.log('save')} />
                  </>
                )}
              </SlideViewNavBar>
            }
          >
            <Query
              query={editableTaskListQuery}
              variables={{
                ...queryVariables,
                filterBy: {
                  ...queryVariables.filterBy,
                  entities,
                },
              }}
              fetchPolicy="network-only"
            >
              {({ data, error, loading }) => {
                if (error) {
                  return error.message;
                }
                if (loading) {
                  return <LoadingIcon />;
                }

                const tasks = getByPathWithDefault([], 'tasks.nodes', data);

                return (
                  <TaskListInSlide
                    tasks={tasks}
                    initDetailValues={taskListContainer.initDetailValues}
                  />
                );
              }}
            </Query>
          </Layout>
        )}
      </Subscribe>
    </Provider>
  );
};

export default injectIntl(EditableTaskList);
