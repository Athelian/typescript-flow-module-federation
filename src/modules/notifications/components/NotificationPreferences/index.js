// @flow
import * as React from 'react';
import {
  type NotificationType,
  NotificationTypeValues,
  NotificationPreference,
} from 'generated/graphql';
import { useQuery } from '@apollo/react-hooks';
import LoadingIcon from 'components/LoadingIcon';
import Dialog from 'components/Dialog';
import { FormattedMessage } from 'react-intl';
import { ToggleInput, SelectInputFactory } from 'components/Form';
import { ApplyButton, ResetButton } from 'components/Buttons';
import { Tooltip } from 'components/Tooltip';
import Icon from 'components/Icon';
import { notificationPreferencesQuery } from 'modules/notifications/query';
import PreferenceSetting from '../PreferenceSetting';
import messages from './messages';
import {
  NotificationPreferencesModalWrapperStyle,
  NavbarWrapperStyle,
  EmailNotificationsWrapperStyle,
  NavbarRightWrapperStyle,
  InfoTooltipWrapperStyle,
} from './style';

type Props = {|
  isOpen: boolean,
  onClose: () => void,
|};

const preferencesByType = ({
  entity,
  ignoreKeys = [],
  preferences = [],
}: {
  entity: string,
  preferences: Array<NotificationPreference>,
  ignoreKeys?: Array<string>,
}): Array<NotificationType> => {
  return Object.values(NotificationTypeValues)
    .filter(key => String(key).startsWith(entity) && !ignoreKeys.includes(entity))
    .map(type => ({
      type,
      title: (
        <FormattedMessage
          {...(messages?.[type] ?? {
            id: `modules.Notification.preferences.${String(type)}`,
            defaultMessage: type,
          })}
        />
      ),
      enabled: preferences.find(item => item?.type === type)?.enabled ?? false,
    }));
};

function NotificationPreferences({ isOpen, onClose }: Props) {
  const [isEmailNotificationsEnabled, setEmailNotificationsEnabled] = React.useState(false);
  const [preferences, setPreferences] = React.useState([]);
  const [timer, setTimer] = React.useState({});
  const { data, loading, error } = useQuery(notificationPreferencesQuery, {
    onCompleted: result => {
      setEmailNotificationsEnabled(result?.viewer?.notificationPreferences?.allowedEmail ?? false);
      setPreferences(result?.viewer?.notificationPreferences?.notifications ?? []);
      setTimer(
        result?.viewer?.notificationPreferences?.emailInterval ?? {
          hours: 0,
          minutes: 10,
        }
      );
    },
  });

  // TODO: check dirty
  const isDirty =
    data?.viewer?.notificationPreferences?.allowedEmail !== isEmailNotificationsEnabled;

  const togglePreference = (type: string, enabled: boolean) => {
    setPreferences([...preferences.filter(item => item.type !== type), { type, enabled }]);
  };

  // TODO: handle mutation
  const handleApply = () => {};

  const handleReset = React.useCallback(() => {
    setEmailNotificationsEnabled(data?.viewer?.notificationPreferences?.allowedEmail ?? false);
    setPreferences(data?.viewer?.notificationPreferences?.notifications ?? []);
    setTimer(
      data?.viewer?.notificationPreferences?.emailInterval ?? {
        minutes: 10,
      }
    );
  }, [data]);

  // Clear state after closing setting
  React.useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [handleReset, isOpen]);

  if (error) {
    return error.message;
  }

  const interval = timer.hours ? { hours: timer.hours } : { minutes: timer.minutes };

  return (
    <Dialog isOpen={isOpen} onRequestClose={onClose}>
      <div className={NotificationPreferencesModalWrapperStyle}>
        <div className={NavbarWrapperStyle}>
          <div className={EmailNotificationsWrapperStyle(isEmailNotificationsEnabled)}>
            <Icon icon="EMAIL" />

            <FormattedMessage
              id="modules.Notifications.emailNotification"
              defaultMessage="Email Notifications"
            />

            <Tooltip
              message={
                isEmailNotificationsEnabled ? (
                  <FormattedMessage
                    id="modules.Notifications.emailTooltipEnabled"
                    defaultMessage="Notifications received will also be sent to your email at the specified interval"
                  />
                ) : (
                  <FormattedMessage
                    id="modules.Notifications.emailTooltipDisabled"
                    defaultMessage="Notifications received will not be sent to your email"
                  />
                )
              }
            >
              <div>
                <ToggleInput
                  toggled={isEmailNotificationsEnabled}
                  onToggle={() => setEmailNotificationsEnabled(!isEmailNotificationsEnabled)}
                />
              </div>
            </Tooltip>

            {isEmailNotificationsEnabled && (
              <SelectInputFactory
                value={interval}
                items={[
                  {
                    label: '10 min',
                    value: { minutes: 10 },
                  },
                  {
                    label: '30 min',
                    value: { minutes: 30 },
                  },
                  {
                    label: '1 hr',
                    value: { hours: 1 },
                  },
                  {
                    label: '6 hrs',
                    value: { hours: 6 },
                  },
                  {
                    label: '12 hrs',
                    value: { hours: 12 },
                  },
                ]}
                inputWidth="60px"
                inputHeight="20px"
                editable
                required
                hideDropdownArrow
                hideTooltip
              />
            )}
          </div>

          <div className={NavbarRightWrapperStyle}>
            {isDirty && (
              <>
                <ResetButton onClick={handleReset} />
                <ApplyButton onClick={handleApply} />
              </>
            )}

            <Tooltip
              message={
                <FormattedMessage
                  id="modules.Notifications.settingTooltip"
                  defaultMessage="Changing your notification preferences will take effect on all data that you are following"
                />
              }
            >
              <div className={InfoTooltipWrapperStyle}>
                <Icon icon="INFO" />
              </div>
            </Tooltip>
          </div>
        </div>

        {loading ? (
          <LoadingIcon />
        ) : (
          <>
            <PreferenceSetting
              icon="ORDER"
              preferences={preferencesByType({
                preferences,
                entity: 'order',
                ignoreKeys: ['order_create_item', 'order_update_item_quantity'],
              })}
              onChange={togglePreference}
            />

            <PreferenceSetting
              icon="ORDER_ITEM"
              preferences={[
                ...preferencesByType({
                  preferences,
                  entity: 'order_create_item',
                }),
                ...preferencesByType({
                  preferences,
                  entity: 'order_update_item_quantity',
                }),
              ]}
              onChange={togglePreference}
            />

            <PreferenceSetting
              icon="PRODUCT"
              preferences={preferencesByType({
                preferences,
                entity: 'product',
                ignoreKeys: ['product_create_provider'],
              })}
              onChange={togglePreference}
            />

            <PreferenceSetting
              icon="PRODUCT_PROVIDER"
              preferences={preferencesByType({
                preferences,
                entity: 'product_create_provider',
              })}
              onChange={togglePreference}
            />

            <PreferenceSetting
              icon="BATCH"
              preferences={preferencesByType({
                preferences,
                entity: 'batch',
              })}
              onChange={togglePreference}
            />

            <PreferenceSetting
              icon="SHIPMENT"
              preferences={preferencesByType({
                preferences,
                entity: 'shipment',
              })}
              onChange={togglePreference}
            />

            <PreferenceSetting
              icon="CONTAINER"
              preferences={preferencesByType({
                preferences,
                entity: 'container',
              })}
              onChange={togglePreference}
            />

            <PreferenceSetting
              icon="WAREHOUSE"
              preferences={preferencesByType({
                preferences,
                entity: 'warehouse',
              })}
              onChange={togglePreference}
            />

            <PreferenceSetting
              icon="LOGS"
              preferences={preferencesByType({
                preferences,
                entity: 'comment',
              })}
              onChange={togglePreference}
            />
          </>
        )}
      </div>
    </Dialog>
  );
}

export default NotificationPreferences;
