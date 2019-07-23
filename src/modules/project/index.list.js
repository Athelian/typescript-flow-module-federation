// @flow
import React from 'react';
import { Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Content } from 'components/Layout';
import { NavBar } from 'components/NavBar';
import { NewButton, ExportButton } from 'components/Buttons';
import { PROJECT_CREATE } from 'modules/permission/constants/project';
import FilterToolBar from 'components/common/FilterToolBar';
import usePermission from 'hooks/usePermission';
import useFilter from 'hooks/useFilter';
import ProjectList from './list';
import messages from './messages';
import { projectsExportQuery } from './query';

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

const ProjectListModule = (props: Props) => {
  const { intl } = props;
  const { hasPermission } = usePermission();

  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.name), value: 'name' },
    { title: intl.formatMessage(messages.dueDate), value: 'dueDate' },
  ];

  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    getInitFilter(),
    'filterProject'
  );

  return (
    <Content>
      <NavBar>
        <FilterToolBar
          icon="PROJECT"
          sortFields={sortFields}
          filtersAndSort={filterAndSort}
          onChange={onChangeFilter}
          canSort
          canSearch
        />
        {hasPermission(PROJECT_CREATE) && (
          <Link to="new">
            <NewButton />
          </Link>
        )}
        <ExportButton
          type="Projects"
          exportQuery={projectsExportQuery}
          variables={{
            filterBy: filterAndSort.filter,
            sortBy: {
              [filterAndSort.sort.field]: filterAndSort.sort.direction,
            },
          }}
        />
      </NavBar>
      <ProjectList {...queryVariables} />
    </Content>
  );
};

export default injectIntl(ProjectListModule);
