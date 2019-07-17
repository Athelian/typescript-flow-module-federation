// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { TAG_CREATE } from 'modules/permission/constants/tag';
import usePermission from 'hooks/usePermission';
import { Content } from 'components/Layout';
import Portal from 'components/Portal';
import { EntityIcon, SortInput } from 'components/NavBar';
import { ExportButton, NewButton } from 'components/Buttons';
import { currentSort } from 'components/common/FilterToolBar';
import useFilter from 'hooks/useFilter';
import TagsList from './list';
import { tagsExportQuery } from './query';
import messages from './messages';

type Props = {
  intl: IntlShape,
};

const getInitFilter = () => {
  const filter = {
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
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.name), value: 'name' },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(getInitFilter(), 'filterTag');
  const { hasPermission } = usePermission();
  const allowCreate = hasPermission(TAG_CREATE);
  return (
    <Content>
      <Portal>
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
        <ExportButton
          type="Tags"
          exportQuery={tagsExportQuery}
          variables={{
            filterBy: filterAndSort.filter,
            sortBy: {
              [filterAndSort.sort.field]: filterAndSort.sort.direction,
            },
          }}
        />
      </Portal>
      <TagsList {...queryVariables} />
    </Content>
  );
};

export default injectIntl(TagListModule);
