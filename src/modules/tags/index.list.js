// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { TAG_CREATE } from 'modules/permission/constants/tag';
import usePermission from 'hooks/usePermission';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import NavBar, { EntityIcon, SortInput } from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import { currentSort } from 'components/common/FilterToolBar';
import useListConfig from 'hooks/useListConfig';
import TagsList from './list';
import messages from './messages';

type Props = {
  intl: IntlShape,
};

type State = {
  viewType: string,
  filter: {
    entityTypes: Array<string>,
  },
  perPage: number,
  page: number,
};
const getInitFilter = () => {
  const filter: State = {
    viewType: 'grid',
    filter: {
      entityTypes: ['Product', 'Order', 'Batch', 'Shipment', 'User'],
    },
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
    perPage: 10,
    page: 1,
  };
  return filter;
};

const TagListModule = (props: Props) => {
  const { intl } = props;
  const sortFields = [
    { title: intl.formatMessage(messages.name), value: 'name' },
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useListConfig(
    getInitFilter(),
    'filterTag'
  );
  const { hasPermission } = usePermission();
  const allowCreate = hasPermission(TAG_CREATE);
  return (
    <UIConsumer>
      {uiState => (
        <Layout
          {...uiState}
          navBar={
            <NavBar>
              <EntityIcon icon="TAG" color="TAG" />
              <SortInput
                sort={currentSort(sortFields, filterAndSort.sort)}
                ascending={filterAndSort.sort.direction !== 'DESCENDING'}
                fields={sortFields}
                onChange={({ field: { value }, ascending }) =>
                  onChangeFilter({
                    sort: {
                      field: value,
                      direction: ascending ? 'ASCENDING' : 'DESCENDING',
                    },
                  })
                }
              />
              {allowCreate && (
                <Link to="new">
                  <NewButton data-testid="newButton" />
                </Link>
              )}
            </NavBar>
          }
        >
          <TagsList {...queryVariables} />
        </Layout>
      )}
    </UIConsumer>
  );
};

export default injectIntl(TagListModule);
