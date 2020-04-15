// @flow
import * as React from 'react';
import { usersQuery } from 'graphql/staff/query';
import type { User } from 'generated/graphql';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import Selector from 'components/Selector';
import { Label, Display } from 'components/Form';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { SaveButton, CancelButton } from 'components/Buttons';
import { StaffCard } from 'components/Cards';
import StaffGridView from 'modules/staff/list/StaffGridView';
import {
  EntityIcon,
  Filter,
  Search,
  Sort,
  UserFilterConfig,
  UserSortConfig,
} from 'components/NavBar';
import { OverlayStyle } from './style';

type Props = {|
  selected: Array<User>,
  isProcessing?: boolean,
  onSelect: (values: Array<User>) => void,
  onCancel: () => void,
  organizationIds: Array<string>,
|};

const StaffSelector = ({
  selected = [],
  isProcessing = false,
  onCancel,
  onSelect,
  organizationIds = [],
}: Props) => {
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
    <Selector.Many selected={selected}>
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

            <div>
              <Label>Selected</Label>
              <Display>{value.length}</Display>
            </div>

            <CancelButton onClick={onCancel} />
            <SaveButton
              data-testid="saveButtonFollowers"
              disabled={!dirty}
              onClick={() => {
                onSelect(value);
              }}
              isLoading={isProcessing}
            />
          </SlideViewNavBar>

          <Content>
            <>
              {isProcessing && <div className={OverlayStyle} />}
              <StaffGridView
                hasMore={hasMore}
                isLoading={loading}
                onLoadMore={loadMore}
                items={nodes}
                renderItem={item => (
                  <StaffCard key={item.id} staff={item} {...getItemProps(item)} />
                )}
              />
            </>
          </Content>
        </SlideViewLayout>
      )}
    </Selector.Many>
  );
};

export default StaffSelector;
