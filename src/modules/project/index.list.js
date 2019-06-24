// @flow
import React from 'react';
import { Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import Layout from 'components/Layout';
import NavBar from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import { PROJECT_CREATE } from 'modules/permission/constants/project';
import FilterToolBar from 'components/common/FilterToolBar';
import { UIConsumer } from 'modules/ui';
import usePermission from 'hooks/usePermission';
import useFilter from 'hooks/useFilter';
import ProjectList from './list';
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
    <UIConsumer>
      {uiState => (
        <Layout
          {...uiState}
          navBar={
            <NavBar>
              <FilterToolBar
                icon="PROJECT"
                sortFields={sortFields}
                filtersAndSort={filterAndSort}
                onChange={onChangeFilter}
              />
              {hasPermission(PROJECT_CREATE) && (
                <Link to="new">
                  <NewButton />
                </Link>
              )}
            </NavBar>
          }
        >
          <ProjectList {...queryVariables} />
        </Layout>
      )}
    </UIConsumer>
  );
};

export default injectIntl(ProjectListModule);
