// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import FilterToolBar from 'components/common/FilterToolBar';
import { ExportButton } from 'components/Buttons';
import useFilter from 'hooks/useFilter';
import { Content } from 'components/Layout';
import { NavBar } from 'components/NavBar';
import TaskList from './list';
import { tasksExportQuery } from './query';
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
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.name), value: 'name' },
    { title: intl.formatMessage(messages.startDate), value: 'startDate' },
    { title: intl.formatMessage(messages.dueDate), value: 'dueDate' },
    { title: intl.formatMessage(messages.entity), value: 'entity' },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    getInitFilter(),
    'filterTask'
  );
  return (
    <Content>
      <NavBar>
        <FilterToolBar
          icon="TASK"
          sortFields={sortFields}
          filtersAndSort={filterAndSort}
          onChange={onChangeFilter}
          canSearch
        />
        <ExportButton
          type="Tasks"
          exportQuery={tasksExportQuery}
          variables={{
            filterBy: filterAndSort.filter,
            sortBy: {
              [filterAndSort.sort.field]: filterAndSort.sort.direction,
            },
          }}
        />
      </NavBar>
      <TaskList {...queryVariables} />
    </Content>
  );
};

export default injectIntl(TaskModule);
