// @flow
import * as React from 'react';
import { ArrayValue } from 'react-values';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import UserListProvider from 'providers/UserList';
import Layout from 'components/Layout';
import LoadingIcon from 'components/LoadingIcon';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import StaffGridView from 'modules/staff/list/StaffGridView';
import { StaffCard } from 'components/Cards';
import { type UserAvatarType } from 'types';

type OptionalProps = {
  selected: Array<UserAvatarType>,
  filterBy: Object,
};

type Props = OptionalProps & {
  onSelect: (values: Array<UserAvatarType>) => void,
  onCancel: () => void,
};

const defaultProps = {
  selected: [],
  filterBy: {},
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

const AssignUsers = ({ selected, onCancel, onSelect, filterBy }: Props) => (
  <UserListProvider filterBy={filterBy}>
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
                  <EntityIcon icon="STAFF" color="STAFF" />
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
                onLoadMore={() => loadMore({ fetchMore, data }, {}, 'users')}
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

AssignUsers.defaultProps = defaultProps;

export default AssignUsers;
