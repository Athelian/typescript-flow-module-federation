// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { TASK_CREATE } from 'modules/permission/constants/task';
import usePermission from 'hooks/usePermission';
import Layout from 'components/Layout';
import FilterToolBar from 'components/common/FilterToolBar';
import useFilter from 'hooks/useFilter';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import TaskList from './list';
import messages from './messages';

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
const TaskModule = (props: Props) => {
  const { intl } = props;

  const sortFields = [
    { title: intl.formatMessage(messages.createdAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.updatedAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.startDate), value: 'startDate' },
    { title: intl.formatMessage(messages.dueDate), value: 'dueDate' },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    getInitFilter(),
    'filterTask'
  );
  const { hasPermission } = usePermission();
  const allowCreate = hasPermission(TASK_CREATE);
  return (
    <UIConsumer>
      {uiState => (
        <Layout
          {...uiState}
          navBar={
            <NavBar>
              <FilterToolBar
                icon="TASK"
                sortFields={sortFields}
                filtersAndSort={filterAndSort}
                onChange={onChangeFilter}
              />
              {allowCreate && (
                <Link to="new">
                  <NewButton />
                </Link>
              )}
            </NavBar>
          }
        >
          <TaskList {...queryVariables} />
        </Layout>
      )}
    </UIConsumer>
  );
};

export default injectIntl(TaskModule);
