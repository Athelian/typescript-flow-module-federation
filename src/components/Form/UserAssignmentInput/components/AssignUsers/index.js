// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { ArrayValue } from 'react-values';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import useFilter from 'hooks/useFilter';
import loadMore from 'utils/loadMore';
import UserListProvider from 'providers/UserListProvider';
import Layout from 'components/Layout';
import LoadingIcon from 'components/LoadingIcon';
import { SlideViewNavBar } from 'components/NavBar';
import FilterToolBar from 'components/common/FilterToolBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import StaffGridView from 'modules/staff/list/StaffGridView';
import { StaffCard } from 'components/Cards';
import { type UserAvatarType } from 'types';
import messages from './messages';

type OptionalProps = {
  cacheKey: string,
  selected: Array<UserAvatarType>,
  filterBy: Object,
};

type Props = OptionalProps & {
  intl: IntlShape,
  onSelect: (values: Array<UserAvatarType>) => void,
  onCancel: () => void,
};

const defaultProps = {
  selected: [],
  filterBy: {},
  cacheKey: 'AssignUsers',
};

const MAX_SELECTIONS = 5;

function onAssignUsers({
  selected,
  item,
  push,
  set,
}: {
  selected: Array<UserAvatarType>,
  item: UserAvatarType,
  push: Function,
  set: Function,
}) {
  if (!selected.includes(item)) {
    if (selected.length < MAX_SELECTIONS) push(item);
  } else {
    set(selected.filter((orderItem: Object) => orderItem.id !== item.id));
  }
}

const selectedItems = (
  selected: Array<{ id: string, firstName: string, lastName: string }>,
  items: Array<Object>
) => {
  if (selected) {
    const itemIds = selected.length ? selected.map(item => item.id) : [];
    return items.filter(item => itemIds.includes(item.id));
  }
  return [];
};

const AssignUsers = ({ intl, cacheKey, selected, onCancel, onSelect, filterBy }: Props) => {
  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.firstName), value: 'firstName' },
    { title: intl.formatMessage(messages.lastName), value: 'lastName' },
    { title: intl.formatMessage(messages.fullName), value: 'fullName' },
  ];

  const initialFilter = {
    filter: filterBy,
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
    page: 1,
    perPage: 10,
  };

  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(initialFilter, cacheKey);

  return (
    <UserListProvider queryVariables={queryVariables}>
      {({ loading, error, fetchMore, data }) => {
        if (error) {
          return error.message;
        }

        if (loading) return <LoadingIcon />;

        const nextPage = getByPathWithDefault(1, 'users.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'users.totalPage', data);
        const hasMore = nextPage <= totalPage;
        return (
          <ArrayValue
            defaultValue={selectedItems(selected, getByPathWithDefault([], 'users.nodes', data))}
          >
            {({ value: values, push, set }) => (
              <Layout
                navBar={
                  <SlideViewNavBar>
                    <FilterToolBar
                      icon="STAFF"
                      sortFields={sortFields}
                      filtersAndSort={filterAndSort}
                      onChange={onChangeFilter}
                    />
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
                }
              >
                <StaffGridView
                  hasMore={hasMore}
                  isLoading={loading}
                  onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, 'users')}
                  items={getByPathWithDefault([], 'users.nodes', data)}
                  renderItem={item => (
                    <StaffCard
                      staff={item}
                      onSelect={() => onAssignUsers({ selected: values, item, push, set })}
                      selectable
                      selected={values.includes(item)}
                      key={item.id}
                    />
                  )}
                />
              </Layout>
            )}
          </ArrayValue>
        );
      }}
    </UserListProvider>
  );
};

AssignUsers.defaultProps = defaultProps;

export default injectIntl(AssignUsers);
