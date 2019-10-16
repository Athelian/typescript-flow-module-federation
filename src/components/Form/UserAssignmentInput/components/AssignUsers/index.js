// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { ArrayValue } from 'react-values';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import { usersQuery } from 'graphql/staff/query';
import useFilterSort from 'hooks/useFilterSort';
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

  const queryVariables = { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 10 };

  return (
    <Query fetchPolicy="network-only" query={usersQuery} variables={queryVariables}>
      {({ loading, error, fetchMore, data }) => {
        if (error) {
          return error.message;
        }

        const items = getByPathWithDefault([], 'users.nodes', data);
        const nextPage = getByPathWithDefault(1, 'users.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'users.totalPage', data);
        const hasMore = nextPage <= totalPage;

        return (
          <ArrayValue defaultValue={selected}>
            {({ value: values, push, filter }) => {
              return (
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
                      {values.length}/{MAX_SELECTIONS}
                    </h3>

                    <CancelButton onClick={onCancel} />
                    <SaveButton
                      data-testid="saveButtonOnAssignUsers"
                      disabled={isEquals(values, selected)}
                      onClick={() => onSelect(values)}
                    />
                  </SlideViewNavBar>

                  <Content>
                    <StaffGridView
                      hasMore={hasMore}
                      isLoading={loading}
                      onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, 'users')}
                      items={items}
                      renderItem={item => {
                        const isSelected = values.some(({ id }) => id === item.id);
                        return (
                          <StaffCard
                            key={item.id}
                            staff={item}
                            onSelect={() => {
                              if (isSelected) {
                                filter(({ id }) => id !== item.id);
                              } else if (values.length < MAX_SELECTIONS) {
                                push(item);
                              }
                            }}
                            selectable
                            selected={isSelected}
                          />
                        );
                      }}
                    />
                  </Content>
                </SlideViewLayout>
              );
            }}
          </ArrayValue>
        );
      }}
    </Query>
  );
};

AssignUsers.defaultProps = defaultProps;

export default AssignUsers;
