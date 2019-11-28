// @flow
import * as React from 'react';
import { usersQuery } from 'graphql/staff/query';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import Selector from 'components/Selector';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { SaveButton, CancelButton } from 'components/Buttons';
import {
  EntityIcon,
  Filter,
  Search,
  Sort,
  UserFilterConfig,
  UserSortConfig,
} from 'components/NavBar';
import { StaffCard } from 'components/Cards';
import StaffGridView from 'modules/staff/list/StaffGridView';
import { type UserAvatarType } from 'types';

type OptionalProps = {
  selected: Array<UserAvatarType>,
  organizationIds: Array<string>,
};

type Props = OptionalProps & {
  onSelect: (values: Array<UserAvatarType>) => void,
  onCancel: () => void,
};

const defaultProps = {
  selected: [],
  organizationIds: [],
};

const MAX_SELECTIONS = 5;

const AssignUsers = ({ selected, onCancel, onSelect, organizationIds }: Props) => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', organizationIds },
    { updatedAt: 'DESCENDING' }
  );

  const { nodes, loading, hasMore, loadMore } = useQueryList(
    usersQuery,
    {
      variables: { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 10 },
      fetchPolicy: 'network-only',
    },
    'users'
  );

  return (
    <Selector.Many selected={selected} max={MAX_SELECTIONS}>
      {({ value, dirty, getItemProps }) => (
        <SlideViewLayout>
          <SlideViewNavBar>
            <EntityIcon icon="STAFF" color="STAFF" />

            <Filter
              config={UserFilterConfig}
              filterBy={filterBy}
              onChange={setFilterBy}
              staticFilters={['organizationIds']}
            />
            <Search query={query} onChange={setQuery} />
            <Sort config={UserSortConfig} sortBy={sortBy} onChange={setSortBy} />

            <h3>
              {value.length}/{MAX_SELECTIONS}
            </h3>

            <CancelButton onClick={onCancel} />
            <SaveButton
              data-testid="saveButtonOnAssignUsers"
              disabled={!dirty}
              onClick={() => onSelect(value)}
            />
          </SlideViewNavBar>

          <Content>
            <StaffGridView
              hasMore={hasMore}
              isLoading={loading}
              onLoadMore={loadMore}
              items={nodes}
              renderItem={item => <StaffCard key={item.id} staff={item} {...getItemProps(item)} />}
            />
          </Content>
        </SlideViewLayout>
      )}
    </Selector.Many>
  );
};

AssignUsers.defaultProps = defaultProps;

export default AssignUsers;
