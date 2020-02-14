// @flow
import * as React from 'react';
import {
  type NotificationType,
  NotificationTypeValues,
  NotificationPreference,
} from 'generated/graphql';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { isEquals } from 'utils/fp';
import { removeTypename } from 'utils/data';
import LoadingIcon from 'components/LoadingIcon';
import Dialog from 'components/Dialog';
import { FormattedMessage } from 'react-intl';
import { ToggleInput, SelectInputFactory } from 'components/Form';
import { ApplyButton, ResetButton } from 'components/Buttons';
import { Tooltip } from 'components/Tooltip';
import Icon from 'components/Icon';
import { notificationPreferencesQuery } from 'modules/notifications/query';
import PreferenceSetting from '../PreferenceSetting';
import { notificationPreferencesUpdateMutation } from './mutation';
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
    .filter(key => String(key).startsWith(entity) && !ignoreKeys.includes(key))
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

const defaultTimer = {
  hours: 0,
  minutes: 10,
};

function convertTimer(timer: string) {
  if (timer.includes('h')) {
    const [hours] = timer.split('h');
    return {
      hours: Number(hours),
      minutes: 0,
    };
  }

  const [minutes] = timer.split('m');
  return {
    minutes: Number(minutes),
    hours: 0,
  };
}

function NotificationPreferences({ isOpen, onClose }: Props) {
  const [notificationPreferencesUpdate] = useMutation(notificationPreferencesUpdateMutation);
  const [isEmailNotificationsEnabled, setEmailNotificationsEnabled] = React.useState(false);
  const [preferences, setPreferences] = React.useState([]);
  const [timer, setTimer] = React.useState(defaultTimer);
  const { data, loading, error, refetch } = useQuery(notificationPreferencesQuery, {
    onCompleted: result => {
      setEmailNotificationsEnabled(result?.viewer?.notificationPreferences?.allowedEmail ?? false);
      setPreferences(result?.viewer?.notificationPreferences?.notifications ?? []);
      setTimer(result?.viewer?.notificationPreferences?.emailInterval ?? defaultTimer);
    },
  });

  const isDirty =
    data?.viewer?.notificationPreferences?.allowedEmail !== isEmailNotificationsEnabled ||
    !isEquals(data?.viewer?.notificationPreferences?.emailInterval ?? defaultTimer, timer) ||
    !isEquals(data?.viewer?.notificationPreferences?.notifications ?? [], preferences);

  const togglePreference = (type: string, enabled: boolean) => {
    setPreferences(preferences.map(item => (item.type === type ? { ...item, enabled } : item)));
  };

  const handleApply = () => {
    notificationPreferencesUpdate({
      variables: {
        input: {
          allowedEmail: isEmailNotificationsEnabled,
          emailInterval: {
            years: 0,
            months: 0,
            weeks: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            nanos: 0,
            ...removeTypename(timer),
          },
          notifications: preferences.map(({ type, enabled }) => ({ type, enabled })),
        },
      },
    }).then(() => {
      refetch();
    });
  };

  const handleReset = React.useCallback(() => {
    setEmailNotificationsEnabled(data?.viewer?.notificationPreferences?.allowedEmail ?? false);
    setPreferences(data?.viewer?.notificationPreferences?.notifications ?? []);
    setTimer(data?.viewer?.notificationPreferences?.emailInterval ?? defaultTimer);
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

  const interval = timer.hours ? `${timer.hours}h` : `${timer.minutes}m`;

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
                    value: '10m',
                  },
                  {
                    label: '30 min',
                    value: '30m',
                  },
                  {
                    label: '1 hr',
                    value: '1h',
                  },
                  {
                    label: '6 hrs',
                    value: '6h',
                  },
                  {
                    label: '12 hrs',
                    value: '12h',
                  },
                ]}
                inputWidth="60px"
                inputHeight="20px"
                editable
                required
                hideDropdownArrow
                hideTooltip
                onChange={evt => setTimer(convertTimer(evt.target.value))}
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

        {loading && !data ? (
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
