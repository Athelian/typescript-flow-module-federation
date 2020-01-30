// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { NavBar, EntityIcon, Filter, NotificationFilterConfig } from 'components/NavBar';
import { Content } from 'components/Layout';
import { BaseButton } from 'components/Buttons';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import useFilterSort from 'hooks/useFilterSort';
import NotificationList from './list';
import NotificationPreferences from './components/NotificationPreferences';

type Props = {
  activeTab?: string,
};

const NotificationListModule = ({ activeTab = 'active' }: Props) => {
  const isActive = activeTab === 'active';
  const { filterBy, setFilterBy } = useFilterSort(
    { archived: !isActive },
    { updatedAt: 'DESCENDING' },
    isActive ? 'activeNotification' : 'archiveNotification'
  );

  const [isOpenSetting, setIsOpenSetting] = React.useState(false);
  return (
    <Content>
      <NavBar>
        <EntityIcon icon="NOTIFICATION" color="GRAY" />
        <TabItem
          showTooltip={!isActive}
          tooltipMessage={
            <FormattedMessage id="modules.notifications.active" defaultMessage="Active" />
          }
          active={isActive}
          label={
            isActive && (
              <FormattedMessage id="modules.notifications.active" defaultMessage="Active" />
            )
          }
          icon="ACTIVE"
          onClick={() => {
            if (!isActive) navigate('/notifications/active');
          }}
        />
        <TabItem
          active={!isActive}
          showTooltip={isActive}
          tooltipMessage={
            <FormattedMessage id="modules.notifications.archived" defaultMessage="Archived" />
          }
          label={
            !isActive && (
              <FormattedMessage id="modules.notifications.archived" defaultMessage="Archived" />
            )
          }
          icon="ARCHIVE"
          onClick={() => {
            if (isActive) navigate('/notifications/archive');
          }}
        />
        <Filter config={NotificationFilterConfig} filterBy={filterBy} onChange={setFilterBy} />

        {isActive && (
          <BaseButton
            icon="ARCHIVE"
            label={
              <FormattedMessage id="components.button.archiveAll" defaultMessage="ARCHIVE ALL" />
            }
            textColor="GRAY_DARK"
            backgroundColor="GRAY_SUPER_LIGHT"
            hoverBackgroundColor="GRAY_DARK"
            onClick={() => {}}
          />
        )}

        <BaseButton
          icon="SETTINGS"
          label={
            <FormattedMessage id="components.button.preferences" defaultMessage="PREFERENCES" />
          }
          backgroundColor="GRAY_SUPER_LIGHT"
          textColor="GRAY_DARK"
          hoverBackgroundColor="GRAY_DARK"
          borderRadius="5px"
          onClick={() => {
            setIsOpenSetting(!isOpenSetting);
          }}
        />
      </NavBar>
      <NotificationList key={activeTab} filterBy={filterBy} />
      {isOpenSetting && <NotificationPreferences />}
    </Content>
  );
};

export default NotificationListModule;
