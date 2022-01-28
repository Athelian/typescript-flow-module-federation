/* eslint-disable no-unused-vars, no-redeclare */
// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { navigate } from '@reach/router';
import { NavBar, EntityIcon, Filter, NotificationFilterConfig, Search } from 'components/NavBar';
import { Content } from 'components/Layout';
import { BaseButton } from 'components/Buttons';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import useFilterSort from 'hooks/useFilterSort';
import NotificationList from './list';
import { archiveAllMutation } from './mutation';
// import NotificationPreferences from './components/NotificationPreferences';

type Props = {
  activeTab?: string,
};

const NotificationListModule = ({ activeTab = 'active' }: Props) => {
  const [isOpenSetting, setIsOpenSetting] = React.useState(false);
  const [archiveAll] = useMutation(archiveAllMutation);

  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '' },
    { updatedAt: 'DESCENDING' }
  );

  // const { nodes, loading, hasMore, loadMore } = useQueryList(
  //   usersQuery,
  //   {
  //     variables: { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 10 },
  //     fetchPolicy: 'network-only',
  //   },
  //   'users'
  // );

  const isActive = activeTab === 'active';
  const archived = !isActive;
  return (
    <Content>
      <NavBar>
        <EntityIcon icon="CLOCK" color="ORANGE_DARKER" />
        <Search query={query} onChange={setQuery} />

        {isActive && (
          <BaseButton
            icon="ARCHIVE"
            label={
              <FormattedMessage
                id="components.button.addNewReminder"
                defaultMessage="ADD NEW REMINDER"
              />
            }
            backgroundColor="TEAL"
            hoverBackgroundColor="TEAL_DARK"
            onClick={() => {
              archiveAll();
              if (window.location.href.includes('/notifications/active')) {
                navigate('/notifications');
              } else {
                navigate('/notifications/active');
              }
            }}
          />
        )}
      </NavBar>
      <NotificationList
        key={activeTab}
        filterBy={{
          ...filterBy,
          archived,
        }}
      />
    </Content>
  );
};

export default NotificationListModule;
